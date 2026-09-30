import { STATUS } from '../models/ticketingSession.model.js';

// Queue configuration constants
export const MAX_QUEUE_POSITION = 30000;
export const POSITION_DECREMENT_INTERVAL = 10000;
export const MAX_CONCURRENT_PROCESSING = 500;

export function calculatePosition(createdAt) {
    const now = new Date();
    const creationTime = new Date(createdAt);
    const timeDiffInMs = now - creationTime;

    const positionsPerMs = 0.5;

    let basePosition = Math.floor(timeDiffInMs * positionsPerMs);

    // Apply time-of-day multipliers
    const hour = now.getHours();
    let multiplier = 1;
    if (hour >= 9 && hour <= 11) multiplier = 1.5; // Morning peak
    if (hour >= 19 && hour <= 21) multiplier = 2; // Evening peak

    let finalPosition = Math.floor(basePosition * multiplier);
    finalPosition = Math.max(1, finalPosition);
    finalPosition = Math.min(MAX_QUEUE_POSITION, finalPosition);

    const randomness = Math.floor(Math.random() * 2000) - 1000;
    finalPosition = Math.max(1, finalPosition + randomness);

    return finalPosition;
}

export async function calculatePopularity(ticketDoc, allTicketDocs) {
    if (!ticketDoc || !allTicketDocs?.length) return 5;

    const validTickets = allTicketDocs.filter(
        (t) => typeof t.capacity === 'number' && t.capacity > 0,
    );
    if (!validTickets.length || !ticketDoc.capacity || ticketDoc.capacity <= 0) return 5;

    const capacities = validTickets.map((t) => t.capacity);

    if (capacities.length === 1) return 5;

    const minCapacity = Math.min(...capacities);
    const maxCapacity = Math.max(...capacities);
    const range = maxCapacity - minCapacity;

    if (range === 0) return 5;

    const relativePosition = (ticketDoc.capacity - minCapacity) / range;
    const popularity = Math.round(relativePosition * 9) + 1;

    return Math.max(2, Math.min(10, popularity));
}

// Add at the top of the file
const activeQueueUpdates = new Map();

export const updateQueue = async (io, sessionId, TicketingSession) => {
    const now = new Date();
    const session = await TicketingSession.findById(sessionId);

    if (!session || session.status !== STATUS.WAITING) {
        activeQueueUpdates.delete(sessionId);
        return;
    }

    // Check if there are any clients connected to this session
    const sockets = await io.in(sessionId).allSockets();
    if (sockets.size === 0) {
        console.log(`No clients connected to session ${sessionId}, pausing queue updates`);
        activeQueueUpdates.delete(sessionId);
        return;
    }

    const positionsToDecrease = Math.min(
        Math.floor(Math.random() * MAX_CONCURRENT_PROCESSING) + 1,
        session.queuePosition,
    );

    const newPosition = session.queuePosition - positionsToDecrease;
    const isCompleteQueue = newPosition <= 0;

    await TicketingSession.findByIdAndUpdate(
        sessionId,
        {
            queuePosition: isCompleteQueue ? 0 : newPosition,
            status: isCompleteQueue ? STATUS.IN_PROGRESS : STATUS.WAITING,
            updatedAt: now,
        },
        { new: true },
    );

    if (isCompleteQueue) {
        io.to(sessionId).emit('queueComplete');
        activeQueueUpdates.delete(sessionId);
        return;
    }

    io.to(sessionId).emit('queueUpdate', {
        status: isCompleteQueue ? STATUS.IN_PROGRESS : STATUS.WAITING,
        position: newPosition,
        lastUpdated: now.toISOString(),
    });

    const nextUpdate = POSITION_DECREMENT_INTERVAL + Math.floor(Math.random() * 2000);
    const timeoutId = setTimeout(() => updateQueue(io, sessionId, TicketingSession), nextUpdate);
    activeQueueUpdates.set(sessionId, timeoutId);
};

export const startQueueUpdates = (io, sessionId, TicketingSession) => {
    // Clear any existing queue update for this session
    if (activeQueueUpdates.has(sessionId)) {
        clearTimeout(activeQueueUpdates.get(sessionId));
        activeQueueUpdates.delete(sessionId);
    }

    // Start new queue updates
    updateQueue(io, sessionId, TicketingSession);
};

const activeIntervals = {};

export const sellTickets = async (io, sessionId, TicketingSession) => {
    try {
        // Clear existing interval if any
        if (activeIntervals[sessionId]) {
            clearInterval(activeIntervals[sessionId]);
            delete activeIntervals[sessionId];
        }

        let session = await TicketingSession.findById(sessionId).populate('tickets.ticketId');

        // Initial status check - more thorough
        if (!session || [STATUS.COMPLETED, STATUS.CANCELLED].includes(session.status)) {
            return;
        }

        console.log(`Starting ticket sales for session ${sessionId}`);

        const intervalFn = async () => {
            try {
                // Get fresh session data with each iteration
                session = await TicketingSession.findById(sessionId).populate('tickets.ticketId');

                // If session is no longer valid or completed, clean up
                if (!session || [STATUS.COMPLETED, STATUS.CANCELLED].includes(session.status)) {
                    if (activeIntervals[sessionId]) {
                        clearInterval(activeIntervals[sessionId]);
                        delete activeIntervals[sessionId];
                    }
                    return;
                }

                let anyTicketsSold = false;

                // Process tickets...
                for (const item of session.tickets) {
                    // Quick status check before processing each ticket
                    if ([STATUS.COMPLETED, STATUS.CANCELLED].includes(session.status)) break;

                    const ticket = item.ticketId;
                    if (!ticket) continue;

                    const ticketsAvailable = ticket.capacity - item.sold;
                    if (ticketsAvailable <= 0) {
                        const sockets = await io.in(sessionId).allSockets();
                        if (sockets.size > 0) {
                            io.to(sessionId).emit('ticketSoldOut', {
                                ticket: ticket,
                                timestamp: new Date().toISOString(),
                            });
                        }
                        continue;
                    }

                    const salesRate = Math.max(1, Math.floor(Math.random() * item.popularity * 89));
                    const ticketsToSell = Math.min(salesRate, item.remaining, ticketsAvailable);

                    if (ticketsToSell > 0) {
                        item.sold += ticketsToSell;
                        item.remaining -= ticketsToSell;
                        anyTicketsSold = true;

                        const sockets = await io.in(sessionId).allSockets();
                        if (sockets.size > 0) {
                            io.to(sessionId).emit('ticketSale', {
                                ticket: ticket,
                                sold: ticketsToSell,
                                remaining: ticketsAvailable - ticketsToSell,
                                timestamp: new Date().toISOString(),
                            });
                        }
                    }
                }

                if (anyTicketsSold) {
                    const updatedSession = await TicketingSession.findByIdAndUpdate(
                        sessionId,
                        {
                            tickets: session.tickets,
                            updatedAt: new Date(),
                        },
                        { new: true },
                    ).populate('tickets.ticketId');

                    if (updatedSession) {
                        const sockets = await io.in(sessionId).allSockets();

                        const populatedTickets = updatedSession.tickets.map((item) => ({
                            _id: item.ticketId._id,
                            name: item.ticketId.name,
                            price: item.ticketId.price,
                            capacity: item.ticketId.capacity,
                            sold: item.sold,
                            remaining: item.remaining,
                            popularity: item.popularity,
                        }));
                        if (sockets.size > 0)
                            io.to(sessionId).emit('ticketUpdate', {
                                updates: populatedTickets,
                                timestamp: new Date().toISOString(),
                            });

                        // Check for sell-out condition
                        const allTicketsSold = session.tickets.every(
                            (item) => item.sold >= item.ticketId.capacity || item.remaining === 0,
                        );

                        if (allTicketsSold) {
                            clearInterval(activeIntervals[sessionId]);
                            delete activeIntervals[sessionId];
                            await TicketingSession.findByIdAndUpdate(sessionId, {
                                status: STATUS.CANCELLED,
                                updatedAt: new Date(),
                            });
                            const sockets = await io.in(sessionId).allSockets();
                            if (sockets.size > 0) {
                                io.to(sessionId).emit('sessionComplete', {
                                    message: 'All tickets have been sold',
                                    timestamp: new Date().toISOString(),
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Ticket sales error:`, error);
                if (activeIntervals[sessionId]) {
                    clearInterval(activeIntervals[sessionId]);
                    delete activeIntervals[sessionId];
                }
            }
        };

        // Start the interval
        activeIntervals[sessionId] = setInterval(
            intervalFn,
            10000 + Math.floor(Math.random() * 5000),
        );

        // Run immediately once
        await intervalFn();
    } catch (error) {
        console.error(`sellTickets setup error:`, error);
    }
};
