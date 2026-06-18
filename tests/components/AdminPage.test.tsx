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
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('allows editing a product name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('Test Product');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Product');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(screen.getByText('Updated Product')).toBeInTheDocument();
  });

  it('allows deleting a product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    await user.click(deleteButton);

    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('allows adding a new product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    const nameInput = screen.getByLabelText(/product name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categoryInput = screen.getByLabelText(/category/i);

    await user.type(nameInput, 'New Product');
    await user.type(priceInput, '39.99');
    await user.type(stockInput, '10');
    await user.type(descriptionInput, 'A brand new product');
    await user.type(categoryInput, 'merch');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(screen.getByText('New Product')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });

  it('shows error state when products fail to load', () => {
    vi.mock('@/src/data/products', () => ({
      get products() {
        throw new Error('Failed to load products');
      },
    }));

    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
  });

  it('shows empty state when no products exist', () => {
    vi.mock('@/src/data/products', () => ({
      products: [],
    }));

    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('validates required fields when adding a product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/price is required/i)).toBeInTheDocument();
  });

  it('validates price is a positive number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, '-10');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
  });

  it('validates stock is a non-negative integer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    const stockInput = screen.getByLabelText(/stock/i);
    await user.type(stockInput, '-5');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(screen.getByText(/stock must be non-negative/i)).toBeInTheDocument();
  });

  it('cancels editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByDisplayValue('Test Product')).not.toBeInTheDocument();
  });

  it('handles concurrent edits without data loss', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);
    await user.click(editButtons[1]);

    const firstInput = screen.getAllByDisplayValue('Test Product')[0];
    const secondInput = screen.getAllByDisplayValue('Out of Stock Item')[0];

    await user.clear(firstInput);
    await user.type(firstInput, 'Updated First');
    await user.clear(secondInput);
    await user.type(secondInput, 'Updated Second');

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    await user.click(saveButtons[0]);
    await user.click(saveButtons[1]);

    expect(screen.getByText('Updated First')).toBeInTheDocument();
    expect(screen.getByText('Updated Second')).toBeInTheDocument();
  });
});