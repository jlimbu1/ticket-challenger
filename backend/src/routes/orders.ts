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

router.post('/orders', async (req: Request, res: Response) => {
  try {
    const sessionId = getOrCreateSession(req, res);
    const session = cartStore.get(sessionId);

    if (!session || session.items.size === 0) {
      return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
    }

    const items: CartItem[] = Array.from(session.items.values());
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        items: JSON.stringify(items),
        total,
      },
    });

    session.items.clear();

    res.status(201).json({
      orderId: order.id,
      message: 'The ritual is complete. Your artifacts will arrive in 3-5 business days. Until then, let the music carry you.',
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
});

export default router;