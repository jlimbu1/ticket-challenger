"use client";

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmationPage } from '@/app/confirmation/page';
import { CartProvider } from '@/src/context/CartContext';

vi.mock('@/src/data/products', () => ({
  products: [
    {
      id: '1',
      name: 'Test Product',
      price: 29.99,
      stock: 5,
      image: '/test.jpg',
      description: 'A test product',
      category: 'merch',
    },
    {
      id: '2',
      name: 'Out of Stock Item',
      price: 19.99,
      stock: 0,
      image: '/test2.jpg',
      description: 'Out of stock',
      category: 'vinyl',
    },
  ],
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('ConfirmationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the confirmation page title', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
  });

  it('displays order summary heading', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/tour diary entry/i)).toBeInTheDocument();
  });

  it('shows empty state when no order data is present', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('displays order ID when provided via URL params', () => {
    const mockSearchParams = new URLSearchParams('orderId=ORD-12345&total=59.98');
    vi.spyOn(globalThis, 'window', 'get').mockImplementation(() => ({
      location: {
        search: '?orderId=ORD-12345&total=59.98',
      },
    } as Window));
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/ORD-12345/i)).toBeInTheDocument();
  });

  it('displays total amount when provided via URL params', () => {
    const mockSearchParams = new URLSearchParams('orderId=ORD-12345&total=59.98');
    vi.spyOn(globalThis, 'window', 'get').mockImplementation(() => ({
      location: {
        search: '?orderId=ORD-12345&total=59.98',
      },
    } as Window));
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/\$59\.98/i)).toBeInTheDocument();
  });

  it('renders without crashing when URL params are missing', () => {
    vi.spyOn(globalThis, 'window', 'get').mockImplementation(() => ({
      location: {
        search: '',
      },
    } as Window));
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('displays estimated delivery date', () => {
    const mockSearchParams = new URLSearchParams('orderId=ORD-12345&total=59.98');
    vi.spyOn(globalThis, 'window', 'get').mockImplementation(() => ({
      location: {
        search: '?orderId=ORD-12345&total=59.98',
      },
    } as Window));
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/estimated delivery/i)).toBeInTheDocument();
  });
});