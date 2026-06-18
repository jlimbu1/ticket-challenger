import { Order } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getOrder(orderId: string): Promise<Order> {
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Invalid order ID');
  }

  const response = await fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    throw new Error('Failed to fetch order: ' + response.status);
  }

  const data = await response.json();
  return data as Order;
}