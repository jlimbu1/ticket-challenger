import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
}

interface CartSession {
  items: Map<number, CartItem>;
}

const cartStore = new Map<string, CartSession>();

function getOrCreateSession(req: Request, res: Response): string {
  let sessionId = req.headers['x-session-id'] as string;
  if (!sessionId || !cartStore.has(sessionId)) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    cartStore.set(sessionId, { items: new Map() });
    res.setHeader('x-session-id', sessionId);
  }
  return sessionId;
}

router.post('/cart', async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof productId !== 'number' || productId < 1) {
      return res.status(400).json({ error: 'Invalid productId. Must be a positive number.' });
    }

    const qty = typeof quantity === 'number' && quantity > 0 ? Math.floor(quantity) : 1;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const sessionId = getOrCreateSession(req, res);
    const session = cartStore.get(sessionId)!;

    const existingItem = session.items.get(productId);
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      session.items.set(productId, {
        productId: product.id,
        quantity: qty,
        price: product.price,
        name: product.name,
        imageUrl: product.imageUrl,
      });
    }

    const cartItems = Array.from(session.items.values());
    res.status(200).json({ items: cartItems });
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

router.get('/cart', async (req: Request, res: Response) => {
  try {
    const sessionId = getOrCreateSession(req, res);
    const session = cartStore.get(sessionId);

    if (!session) {
      return res.status(200).json({ items: [] });
    }

    const cartItems = Array.from(session.items.values());
    res.status(200).json({ items: cartItems });
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

router.delete('/cart/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const sessionId = getOrCreateSession(req, res);
    const session = cartStore.get(sessionId);

    if (!session || !session.items.has(productId)) {
      return res.status(404).json({ error: 'Item not found in cart.' });
    }

    session.items.delete(productId);

    const cartItems = Array.from(session.items.values());
    res.status(200).json({ items: cartItems });
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

export default router;