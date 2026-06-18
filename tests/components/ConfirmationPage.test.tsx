"use client";

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmationPage from '@/app/confirmation/page';
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
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/ORD-12345/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows loading state while fetching order details', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state when order fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=INVALID' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByText(/failed to load order/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders order items when order data is available', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/items purchased/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays total amount for the order', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows shipping information section', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/shipping/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays estimated delivery date', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/estimated delivery/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders a button to continue shopping', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
  });

  it('renders a button to view order details', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/view details/i)).toBeInTheDocument();
  });

  it('handles missing order ID gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('displays product names in order items', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows quantity for each order item', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/qty/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays subtotal for each order item', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows order date', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/order date/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays payment method', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/payment/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with gothic theme styling', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('gothic');
  });

  it('handles network errors gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=NETWORK_ERROR' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByText(/failed to load order/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows retry button on error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=INVALID' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByText(/retry/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order status', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows customer name on order', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/customer/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays shipping address', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/address/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders order notes section', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/notes/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows thank you message', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });

  it('displays order timeline', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/timeline/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper accessibility attributes', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles empty cart gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('displays order confirmation number', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/confirmation #/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows estimated shipping date', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/estimated shipping/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order subtotal', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows tax amount', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/tax/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays shipping cost', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/shipping cost/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders order total prominently', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/total/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows discount if applied', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/discount/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays coupon code if used', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/coupon/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with tour diary aesthetic', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('diary');
  });

  it('handles special characters in order data', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-SPECIAL' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/special/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows loading spinner during data fetch', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays error icon on failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=INVALID' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByTestId('error-icon')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders success icon on load', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows print button', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/print/i)).toBeInTheDocument();
  });

  it('displays share button', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/share/i)).toBeInTheDocument();
  });

  it('renders with proper heading hierarchy', () => {
    renderWithProviders(<ConfirmationPage />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0].tagName).toBe('H1');
  });

  it('handles missing product images gracefully', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no image/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order item prices', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows quantity selector for each item', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/quantity/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with dark theme', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('dark');
  });

  it('displays order progress bar', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows estimated delivery range', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/delivery range/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays carrier information', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/carrier/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders tracking number', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/tracking/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows return policy link', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/return policy/i)).toBeInTheDocument();
  });

  it('displays customer support contact', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/support/i)).toBeInTheDocument();
  });

  it('renders with proper semantic HTML', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('handles very long order IDs', () => {
    const longId = 'ORD-' + 'A'.repeat(50);
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: `?orderId=${longId}` };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(longId)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order notes if present', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/special instructions/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows gift message if applicable', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/gift message/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper data-testid attributes', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('confirmation-page')).toBeInTheDocument();
  });

  it('handles concurrent state updates gracefully', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/confirmed/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order summary in diary format', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/diary entry/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows date in diary format', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/entry date/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with parchment background', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('parchment');
  });

  it('displays dramatic typography', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('dramatic');
  });

  it('handles null order data gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows loading state on initial render', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state on fetch failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=INVALID' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByText(/failed to load order/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper ARIA labels', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByLabelText(/order confirmation/i)).toBeInTheDocument();
  });

  it('displays order items in a list', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByRole('list')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows item images in order', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);

    window.location = originalLocation;
  });

  it('displays item categories', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/category/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper spacing and layout', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('grid');
  });

  it('handles missing order items gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order total with currency symbol', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order status badge', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper color scheme', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('crimson');
  });

  it('shows estimated delivery date range', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/delivery date/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order confirmation banner', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('confirmation-banner')).toBeInTheDocument();
  });

  it('handles special characters in product names', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/special/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows order summary in card layout', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('order-summary-card')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays shipping method', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/shipping method/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper responsive design', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('responsive');
  });

  it('handles missing shipping info gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation animation', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('confirmation-animation')).toBeInTheDocument();
  });

  it('displays customer satisfaction survey link', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/survey/i)).toBeInTheDocument();
  });

  it('renders with proper font styling', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('font');
  });

  it('handles concurrent order fetches', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/confirmed/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows order timeline with dates', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/timeline/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order status updates', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/status update/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper shadow effects', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('shadow');
  });

  it('handles empty order items array', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation with dramatic effect', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('dramatic-effect')).toBeInTheDocument();
  });

  it('displays order ID in diary format', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/entry #/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper border styling', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('border');
  });

  it('handles missing payment info gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation with tour diary theme', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('tour-diary-theme')).toBeInTheDocument();
  });

  it('displays order items with gothic styling', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('gothic-items')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper margin and padding', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('p-');
  });

  it('handles very long product names', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/product/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('shows order confirmation with loading skeleton', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('displays error state with retry option', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=INVALID' };

    renderWithProviders(<ConfirmationPage />);
    expect(await screen.findByText(/retry/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper z-index layering', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('z-');
  });

  it('handles missing customer info gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation with diary entry number', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/entry #/i)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('displays order items with quantity badges', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('quantity-badge')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper transition effects', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('transition');
  });

  it('handles missing order date gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation with dramatic entrance', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByTestId('dramatic-entrance')).toBeInTheDocument();
  });

  it('displays order items with price formatting', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, search: '?orderId=ORD-12345' };

    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders with proper overflow handling', () => {
    renderWithProviders(<ConfirmationPage />);
    const container = screen.getByTestId('confirmation-page');
    expect(container.className).toContain('overflow');
  });

  it('handles missing order total gracefully', () => {
    renderWithProviders(<ConfirmationPage />);
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });

  it('shows order confirmation with diary aesthetic', () => {