import mongoose from 'mongoose';

export const ticketSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
