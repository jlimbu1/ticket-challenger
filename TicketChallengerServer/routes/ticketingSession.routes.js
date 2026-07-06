import express from "express";
import { TicketingSession, STATUS } from "../models/ticketingSession.model.js";
import { Ticket } from "../models/ticket.model.js";
import {
  calculatePosition,
  calculatePopularity,
  sellTickets,
  startQueueUpdates,
} from "../helpers/ticketingSession.helpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");
    const username = req.body?.username;

    // Get full ticket documents for the requested tickets
    const ticketDocs = await Ticket.find({});
    const requestedTickets = JSON.parse(JSON.stringify(ticketDocs));

    // Add popularity to each requested ticket in the session
    const sessionTickets = await Promise.all(
      requestedTickets.map(async (requestedTicket) => {
        const ticketDoc = ticketDocs.find((t) =>
          t._id.equals(requestedTicket._id)
        );
        return {
          ticketId: requestedTicket._id,
          remaining: requestedTicket.capacity,
          sold: 0,
          popularity: await calculatePopularity(ticketDoc, ticketDocs),
        };
      })
    );

    const session = new TicketingSession({
      username,
      tickets: sessionTickets,
      status: STATUS.CREATED,
    });

    await session.save();

    sellTickets(io, session._id?.toString(), TicketingSession);

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

router.patch("/startQueue/:id", async (req, res) => {
  try {
    const session = await TicketingSession.findById(req.params.id);
    const io = req.app.get("io");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    const QueuePosition = calculatePosition(session.createdAt);

    const updatedSession = await TicketingSession.findByIdAndUpdate(
      req.params.id,
      {
        status: STATUS.WAITING,
        queuePosition: QueuePosition,
        initialQueuePosition: QueuePosition,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedSession,
      message: "Queue started successfully",
    });

    startQueueUpdates(io, req.params.id, TicketingSession);
  } catch (error) {
    console.error("Error starting queue:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start queue",
    });
  }
});

/**
 * Get Paginated TicketingSessions with optional filtering
 */
router.get("/", async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination params
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid pagination parameters",
      });
    }

    const filter = {};
    if (status) filter.status = status;

    // Get total count
    const total = await TicketingSession.countDocuments(filter);

    // Calculate pagination
    const skip = (pageNumber - 1) * limitNumber;
    const totalPages = Math.ceil(total / limitNumber);

    // Handle normal sorting
    if (sortBy !== "_score") {
      const sortDirection = sortOrder.toLowerCase() === "asc" ? 1 : -1;
      const sort = { [sortBy]: sortDirection };

      const sessions = await TicketingSession.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .populate("tickets.ticketId");

      return res.json({
        success: true,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalItems: total,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
        data: sessions,
      });
    }

    // Special handling for _score sorting
    const allSessions = await TicketingSession.find(filter).populate(
      "tickets.ticketId"
    );

    // Filter out any sessions that might have _score <= 0 (additional safety)
    const sessionsWithScores = allSessions
      .map((session) => ({
        ...session.toObject(),
        _score: session._score,
      }))
      .filter((session) => session._score > 0); // Explicit filter

    sessionsWithScores.sort((a, b) => {
      return sortOrder.toLowerCase() === "asc"
        ? a._score - b._score
        : b._score - a._score;
    });

    // Apply pagination after sorting
    const paginatedSessions = sessionsWithScores.slice(
      skip,
      skip + limitNumber
    );

    res.json({
      success: true,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalItems: sessionsWithScores.length, // Use filtered length for total
        totalPages: Math.ceil(sessionsWithScores.length / limitNumber),
        hasNextPage: skip + limitNumber < sessionsWithScores.length,
        hasPrevPage: pageNumber > 1,
      },
      data: paginatedSessions,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

/**
 * Get a specific TicketingSession
 */
router.get("/:id", async (req, res) => {
  try {
    const session = await TicketingSession.findById(req.params.id).populate(
      "tickets.ticketId"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid session ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// /**
//  * Update a TicketingSession
//  */
// router.patch("/:id", async (req, res) => {
//   try {
//     // Prevent status updates through this endpoint
//     const { status, ...updateData } = req.body;

//     const session = await TicketingSession.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         error: "Session not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: session,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         error: error.message,
//       });
//     }
//     res.status(500).json({
//       success: false,
//       error: "Server Error",
//     });
//   }
// });

// /**
//  * Delete a TicketingSession
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     const session = await TicketingSession.findByIdAndDelete(req.params.id);

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         error: "Session not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Server Error",
//     });
//   }
// });

/**
 * complete the TicketingSession
 */
router.patch("/checkout/:id", async (req, res) => {
  try {
    const requestedTickets = req.body;
    const sessionId = req.params.id;

    // Validate input
    if (!sessionId || !requestedTickets || !Array.isArray(requestedTickets)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request format. Need sessionId and tickets array",
      });
    }

    // Get the session with populated tickets
    const session = await TicketingSession.findById(sessionId).populate(
      "tickets.ticketId"
    );
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check if session is already completed
    if (session.status === STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        error: "Session already completed",
      });
    }

    // Validate ticket availability
    const validationErrors = [];

    for (const requestedTicket of requestedTickets) {
      const sessionTicket = session.tickets.find(
        (t) => t.ticketId._id.toString() === requestedTicket._id
      );

      if (!sessionTicket) {
        validationErrors.push({
          ticketId: requestedTicket._id,
          error: "Ticket not found in session",
        });
        continue;
      }

      if (sessionTicket.remaining < requestedTicket.quantity) {
        validationErrors.push({
          ticketId: requestedTicket._id,
          error: `Not enough tickets available (requested: ${requestedTicket.quantity}, available: ${sessionTicket.remaining})`,
        });
        continue;
      }
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
        message: "Ticket availability validation failed",
      });
    }

    const updatedTickets = session.tickets.map((ticketItem) => {
      const requestedTicket = requestedTickets.find(
        (reqTicket) => reqTicket._id === ticketItem.ticketId._id.toString()
      );
      const boughtUpdate = requestedTicket?.quantity || 0;
      return {
        ...ticketItem.toObject(),
        bought: (ticketItem.bought || 0) + boughtUpdate,
      };
    });

    // Update session
    const updatedSession = await TicketingSession.findByIdAndUpdate(
      sessionId,
      {
        tickets: updatedTickets,
        status: STATUS.COMPLETED,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("tickets.ticketId");

    // Send success response
    res.status(200).json({
      success: true,
      data: updatedSession,
      message: "Checkout complete",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error during checkout",
    });
  }
});

export default router;
