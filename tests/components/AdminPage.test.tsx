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
  });

  it('shows product prices formatted correctly', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('shows stock status for each product', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('has edit buttons for each product', () => {
    renderWithProviders(<AdminPage />);
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it('has delete buttons for each product', () => {
    renderWithProviders(<AdminPage />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('shows add new product form', () => {
    renderWithProviders(<AdminPage />);
    expect(screen.getByPlaceholderText(/product name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  it('adds a new product when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'New Item');
    await user.type(screen.getByPlaceholderText(/price/i), '49.99');
    await user.type(screen.getByPlaceholderText(/stock/i), '10');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('deletes a product when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    expect(screen.getByText('Out of Stock Item')).toBeInTheDocument();
  });

  it('edits a product when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('Test Product');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Product');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(screen.getByText('Updated Product')).toBeInTheDocument();
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('cancels editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test Product')).not.toBeInTheDocument();
  });

  it('shows error state when products fail to load', () => {
    vi.mocked(products).mockImplementationOnce(() => {
      throw new Error('Failed to load');
    });

    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('shows empty state when no products exist', () => {
    vi.mocked(products).mockImplementationOnce(() => []);

    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });

  it('validates required fields in add product form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/price is required/i)).toBeInTheDocument();
  });

  it('validates price is a positive number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'Test');
    await user.type(screen.getByPlaceholderText(/price/i), '-10');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
  });

  it('validates stock is a non-negative integer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(screen.getByPlaceholderText(/product name/i), 'Test');
    await user.type(screen.getByPlaceholderText(/price/i), '10');
    await user.type(screen.getByPlaceholderText(/stock/i), '-5');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(screen.getByText(/stock must be non-negative/i)).toBeInTheDocument();
  });
});