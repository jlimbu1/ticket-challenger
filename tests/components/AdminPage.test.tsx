"use client";

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminPage } from '@/app/admin/page';
import { CartProvider } from '@/src/context/CartContext';
import { products } from '@/src/data/products';

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
    {
      id: '3',
      name: 'Limited Edition Vinyl',
      price: 49.99,
      stock: 2,
      image: '/test3.jpg',
      description: 'A limited edition vinyl record',
      category: 'vinyl',
    },
  ],
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the admin dashboard title', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/backstage pass/i)).toBeInTheDocument();
  });

  it('displays all products in a table', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock Item')).toBeInTheDocument();
    expect(screen.getByText('Limited Edition Vinyl')).toBeInTheDocument();
  });

  it('shows stock status for each product', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays product prices correctly', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('shows add product form', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByPlaceholderText(/product name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  it('allows adding a new product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'New Vinyl');
    await user.type(screen.getByPlaceholderText(/price/i), '39.99');
    await user.type(screen.getByPlaceholderText(/stock/i), '10');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('New Vinyl')).toBeInTheDocument();
    });
  });

  it('allows deleting a product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });
  });

  it('allows editing a product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Product');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Product');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Product')).toBeInTheDocument();
    });
  });

  it('validates required fields when adding product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/stock is required/i)).toBeInTheDocument();
    });
  });

  it('validates price is a positive number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'Test');
    await user.type(screen.getByPlaceholderText(/price/i), '-10');
    await user.type(screen.getByPlaceholderText(/stock/i), '5');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });

  it('validates stock is a non-negative integer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'Test');
    await user.type(screen.getByPlaceholderText(/price/i), '10');
    await user.type(screen.getByPlaceholderText(/stock/i), '-1');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText(/stock must be non-negative/i)).toBeInTheDocument();
    });
  });

  it('cancels editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Test Product')).not.toBeInTheDocument();
    });
  });

  it('shows loading state while products are being fetched', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows empty state when no products exist', async () => {
    vi.mocked(products).mockReturnValue([]);
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText(/no products/i)).toBeInTheDocument();
    });
  });
});