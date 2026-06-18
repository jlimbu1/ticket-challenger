import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import productRoutes from './routes/products';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Product routes
app.use('/api/products', productRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;