import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', cartRouter);
app.use('/api', ordersRouter);

app.get('/api/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;