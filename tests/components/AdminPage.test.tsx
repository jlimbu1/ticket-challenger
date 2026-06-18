import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboardPage from '@/app/admin/page';
import OrderConfirmationPage from '@/app/confirmation/page';
import { products } from '@/src/data/products';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it('renders loading state initially', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product list after loading', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('renders empty state when no products', async () => {
    // Temporarily override products to be empty
    jest.mock('@/src/data/products', () => ({
      products: [],
    }));
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/no products/i)).toBeInTheDocument();
    });
  });

  it('opens add product form', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const addButton = screen.getByText(/add new product/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/add product/i)).toBeInTheDocument();
  });

  it('validates add product form', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const addButton = screen.getByText(/add new product/i);
    fireEvent.click(addButton);
    const submitButton = screen.getByText(/save product/i);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid stock count is required/i)).toBeInTheDocument();
    });
  });

  it('adds a new product', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const addButton = screen.getByText(/add new product/i);
    fireEvent.click(addButton);
    const nameInput = screen.getByLabelText(/product name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const imageInput = screen.getByLabelText(/image url/i);
    await userEvent.type(nameInput, 'Test Product');
    await userEvent.type(priceInput, '29.99');
    await userEvent.type(stockInput, '10');
    await userEvent.type(descriptionInput, 'A test product');
    await userEvent.type(imageInput, '/test.jpg');
    const submitButton = screen.getByText(/save product/i);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('edits an existing product', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const editButtons = screen.getAllByText(/edit/i);
    fireEvent.click(editButtons[0]);
    const nameInput = screen.getByLabelText(/product name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Product');
    const submitButton = screen.getByText(/update product/i);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Updated Product')).toBeInTheDocument();
    });
  });

  it('deletes a product with confirmation', async () => {
    mockConfirm.mockReturnValue(true);
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText(/delete/i);
    const productName = products[0].name;
    fireEvent.click(deleteButtons[0]);
    expect(mockConfirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText(productName)).not.toBeInTheDocument();
    });
  });

  it('cancels delete when confirmation is denied', async () => {
    mockConfirm.mockReturnValue(false);
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText(/delete/i);
    const productName = products[0].name;
    fireEvent.click(deleteButtons[0]);
    expect(mockConfirm).toHaveBeenCalled();
    expect(screen.getByText(productName)).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    // Simulate an error by triggering a re-render with bad data
    const addButton = screen.getByText(/add new product/i);
    fireEvent.click(addButton);
    const priceInput = screen.getByLabelText(/price/i);
    await userEvent.type(priceInput, 'invalid');
    const submitButton = screen.getByText(/save product/i);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/valid price is required/i)).toBeInTheDocument();
    });
  });
});

describe('OrderConfirmationPage', () => {
  const mockOrderData = {
    orderId: 'ORD-12345',
    items: [
      { id: '1', name: 'Product 1', price: 19.99, quantity: 2 },
      { id: '2', name: 'Product 2', price: 29.99, quantity: 1 },
    ],
    total: 69.97,
    shipping: {
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
    },
    date: '2026-06-18',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it('renders empty state when no order data', () => {
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
    expect(screen.getByText(/back to shop/i)).toBeInTheDocument();
  });

  it('renders order confirmation with data', () => {
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockOrderData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/ORD-12345/)).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText(/69.97/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
    expect(screen.getByText(/Portland/)).toBeInTheDocument();
    expect(screen.getByText(/OR/)).toBeInTheDocument();
    expect(screen.getByText(/97201/)).toBeInTheDocument();
  });

  it('renders tour diary layout', () => {
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockOrderData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/tour diary/i)).toBeInTheDocument();
    expect(screen.getByText(/setlist/i)).toBeInTheDocument();
    expect(screen.getByText(/venue/i)).toBeInTheDocument();
  });

  it('renders back to shop link', () => {
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockOrderData));
    render(<OrderConfirmationPage />);
    const backLink = screen.getByText(/back to shop/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/products');
  });

  it('handles malformed sessionStorage data', () => {
    mockSessionStorage.getItem.mockReturnValue('invalid json');
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('handles missing items in order data', () => {
    const incompleteData = { ...mockOrderData, items: [] };
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(incompleteData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSessionStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });
});