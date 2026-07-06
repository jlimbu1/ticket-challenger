import mongoose, { Schema } from "mongoose";
import { Ticket } from "./ticket.model.js";

// Enum for status
const STATUS = Object.freeze({
  CREATED: "created",
  WAITING: "waiting",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

const ticketingSessionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  tickets: [
    {
      ticketId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Ticket.modelName,
      },
      remaining: {
        type: Number,
        default: 0,
        min: 0,
      },
      sold: {
        type: Number,
        default: 0,
        min: 0,
      },
      bought: {
        type: Number,
        default: 0,
        min: 0,
      },
      popularity: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
    },
  ],
  initialQueuePosition: {
    type: Number,
    default: -1,
  },
  queuePosition: {
    type: Number,
    default: -1,
  },
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.CREATED,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add virtual _score field
ticketingSessionSchema.virtual("_score").get(function () {
  if (!this.tickets || this.tickets.length === 0) return 0;

  return this.tickets.reduce((total, ticketItem) => {
    // Ensure we have the populated ticket data
    const ticket =
      ticketItem.ticketId instanceof mongoose.Document
        ? ticketItem.ticketId
        : null;

    if (!ticket || !ticket.price) return total;

    return total + ticketItem.bought * ticket.price;
  }, 0);
});

// Update timestamps
ticketingSessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ticketingSessionSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);

ticketingSessionSchema.set("toJSON", { virtuals: true });
ticketingSessionSchema.set("toObject", { virtuals: true });

// Export the model and STATUS enum
export const TicketingSession = mongoose.model(
  "TicketingSession",
  ticketingSessionSchema
);
export { STATUS };
