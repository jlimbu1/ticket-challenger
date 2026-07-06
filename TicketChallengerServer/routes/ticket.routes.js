// routes/ticket.routes.js
import express from "express";
import { Ticket } from "../models/ticket.model.js";

const router = express.Router();

// Get all Tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().lean();
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// Get a specific Ticket
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).lean();

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error(`Error fetching ticket ${req.params.id}:`, error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ticket ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

export default router;
