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

  it('allows adding a new product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(screen.getByText(/add product/i));

    await user.type(screen.getByLabelText(/name/i), 'New Product');
    await user.type(screen.getByLabelText(/price/i), '39.99');
    await user.type(screen.getByLabelText(/stock/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'A new product');
    await user.type(screen.getByLabelText(/image/i), '/new.jpg');
    await user.selectOptions(screen.getByLabelText(/category/i), 'merch');

    await user.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument();
    });
  });

  it('allows editing an existing product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const editButtons = screen.getAllByText(/edit/i);
    await user.click(editButtons[0]);

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Product');

    await user.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('Updated Product')).toBeInTheDocument();
    });
  });

  it('allows deleting a product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no products exist', () => {
    vi.mocked(products).filter.mockReturnValue([]);
    renderWithProviders(<AdminPage />);
    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });
});