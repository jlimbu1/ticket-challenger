import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface ShippingFields {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface CheckoutRequestBody {
  items: Array<{ productId: string; quantity: number; price: number }>;
  shipping: ShippingFields;
  cardNumber: string;
}

function validateShipping(shipping: ShippingFields): string | null {
  if (!shipping.name || !shipping.name.trim()) {
    return 'Full name is required';
  }
  if (!shipping.address || !shipping.address.trim()) {
    return 'Address is required';
  }
  if (!shipping.city || !shipping.city.trim()) {
    return 'City is required';
  }
  if (!shipping.state || !shipping.state.trim()) {
    return 'State is required';
  }
  if (!shipping.zip || !shipping.zip.trim()) {
    return 'ZIP code is required';
  }
  return null;
}

function validateCardNumber(cardNumber: string): string | null {
  const digits = cardNumber.replace(/\s/g, '');
  if (digits.length === 0) {
    return 'Card number is required';
  }
  if (!/^\d+$/.test(digits)) {
    return 'Card number must contain only digits';
  }
  if (digits.length !== 16) {
    return 'Card number must be 16 digits';
  }
  return null;
}

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '');
  return `**** **** **** ${digits.slice(-4)}`;
}

router.post('/api/checkout', async (req: Request, res: Response) => {
  try {
    const { items, shipping, cardNumber } = req.body as CheckoutRequestBody;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items array is required and must not be empty' });
      return;
    }

    const shippingError = validateShipping(shipping);
    if (shippingError) {
      res.status(400).json({ error: shippingError });
      return;
    }

    const cardError = validateCardNumber(cardNumber);
    if (cardError) {
      res.status(400).json({ error: cardError });
      return;
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        items: JSON.stringify(items),
        shipping: JSON.stringify(shipping),
        cardNumber: maskCardNumber(cardNumber),
        total,
        status: 'confirmed',
      },
    });

    res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

export default router;