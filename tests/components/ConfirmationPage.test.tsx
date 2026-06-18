import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboardPage from '@/app/admin/page';
import OrderConfirmationPage from '@/app/confirmation/page';
import { products } from '@/src/data/products';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

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

  it('displays empty state when no products exist', async () => {
    const originalProducts = [...products];
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
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
  });

  it('validates add product form', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/backstage inventory/i)).toBeInTheDocument();
    });
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    const submitButton = screen.getByText(/save/i);
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
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/price/i), '29.99');
    await userEvent.type(screen.getByLabelText(/stock/i), '10');
    await userEvent.type(screen.getByLabelText(/description/i), 'A test product');
    await userEvent.type(screen.getByLabelText(/image/i), '/test.jpg');
    const submitButton = screen.getByText(/save/i);
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
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Product');
    const submitButton = screen.getByText(/save/i);
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
});

describe('OrderConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it('renders empty state when no order data exists', () => {
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('renders order details from sessionStorage', () => {
    const orderData = {
      orderId: 'ORD-12345',
      items: [
        { name: 'Test Item', quantity: 2, price: 19.99 },
        { name: 'Another Item', quantity: 1, price: 29.99 },
      ],
      total: 69.97,
      shipping: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
      date: '2026-06-18',
    };
    mockSessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/ORD-12345/i)).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Another Item')).toBeInTheDocument();
    expect(screen.getByText(/\$69\.97/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
  });

  it('renders back to shop button', () => {
    const orderData = {
      orderId: 'ORD-12345',
      items: [],
      total: 0,
      shipping: { name: '', email: '', address: '', city: '', state: '', zip: '' },
      date: '2026-06-18',
    };
    mockSessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/back to shop/i)).toBeInTheDocument();
  });

  it('handles malformed sessionStorage data gracefully', () => {
    mockSessionStorage.setItem('lastOrder', 'invalid json');
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('renders tour diary layout', () => {
    const orderData = {
      orderId: 'ORD-12345',
      items: [{ name: 'Test Item', quantity: 1, price: 19.99 }],
      total: 19.99,
      shipping: { name: 'Jane Doe', email: 'jane@example.com', address: '456 Oak Ave', city: 'Somewhere', state: 'NY', zip: '67890' },
      date: '2026-06-18',
    };
    mockSessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    render(<OrderConfirmationPage />);
    expect(screen.getByText(/tour diary/i)).toBeInTheDocument();
    expect(screen.getByText(/setlist/i)).toBeInTheDocument();
  });
});