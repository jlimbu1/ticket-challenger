import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ticketRoutes from './routes/ticket.routes.js';
import ticketingSessionRoutes from './routes/ticketingSession.routes.js';
import { TicketingSession } from './models/ticketingSession.model.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { startQueueUpdates } from './helpers/ticketingSession.helpers.js';
import { verifySessionSecret } from './middleware/auth.js';
import { rateLimit } from './middleware/rateLimit.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Behind nginx/Cloudflare — trust one proxy hop so rate limiting
// sees the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 60000, max: 120 }));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB Atlas connection error:', err);
        process.exit(1);
    }
};

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    path: '/socket.io',
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
});

const activeSessions = new Map(); // Tracks sessionId -> socketId

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    const subscribedRooms = new Set();

    socket.on('subscribeToSession', async ({ sessionId, secret } = {}) => {
        if (!sessionId || !secret) {
            socket.emit('subscriptionRejected', {
                reason: 'Missing session credentials',
            });
            return;
        }

        const sessionDoc = await TicketingSession.findById(sessionId).select('secretHash');
        if (!sessionDoc || !verifySessionSecret(sessionDoc.secretHash, secret)) {
            socket.emit('subscriptionRejected', { reason: 'Unauthorized' });
            return;
        }

        // Check if session already has a client
        if (activeSessions.has(sessionId)) {
            const existingSocketId = activeSessions.get(sessionId);

            // If this is the same client reconnecting, allow it
            if (existingSocketId === socket.id) {
                await socket.join(sessionId);
                subscribedRooms.add(sessionId);
                startQueueUpdates(io, sessionId, TicketingSession); // Restart queue updates
                socket.emit('subscriptionConfirmed', { sessionId });
                return;
            }

            // Reject new connections if session already has a client
            socket.emit('subscriptionRejected', {
                reason: 'Session already has an active client',
            });
            return;
        }

        // Allow connection
        console.log(`Joining ${socket.id} to room ${sessionId}`);
        await socket.join(sessionId);
        subscribedRooms.add(sessionId);
        activeSessions.set(sessionId, socket.id);

        // Start queue updates
        startQueueUpdates(io, sessionId, TicketingSession);

        // Confirm subscription
        socket.emit('subscriptionConfirmed', { sessionId });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Clean up active sessions
        for (const [sessionId, socketId] of activeSessions.entries()) {
            if (socketId === socket.id) {
                activeSessions.delete(sessionId);
                break;
            }
        }
    });
});

app.set('io', io);

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Express.js with MongoDB Server is running!',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/ticketing-sessions', ticketingSessionRoutes);
app.use('/api/tickets', ticketRoutes);
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', socketConnections: io.engine.clientsCount });
});

// Error Handlers
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: status === 500 ? 'Internal Server Error' : err.message,
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer();

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
