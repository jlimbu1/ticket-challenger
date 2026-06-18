import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CartDrawer from '../../src/components/CartDrawer';
import { useCart } from '../../src/hooks/useCart';

vi.mock('../../src/hooks/useCart', () => ({
  useCart: vi.fn(),
}));

const mockUseCart = useCart as ReturnType<typeof vi.fn>;

const mockCartItems = [
  {
    id: 'item-1',
    productId: 'prod-1',
    title: 'The Black Parade',
    price: 29.99,
    quantity: 2,
    imageUrl: '/images/black-parade.jpg',
  },
  {
    id: 'item-2',
    productId: 'prod-2',
    title: 'Three Cheers for Sweet Revenge',
    price: 24.99,
    quantity: 1,
    imageUrl: '/images/three-cheers.jpg',
  },
];

const defaultCartState = {
  items: [],
  total: 0,
  itemCount: 0,
  animationState: 'idle' as const,
  lastAddedItemId: null,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
};

describe('CartDrawer', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({ ...defaultCartState });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct initial state when closed', () => {
    const { container } = render(
      <CartDrawer isOpen={false} onClose={vi.fn()} />
    );

    const drawer = container.querySelector('[data-testid="cart-drawer"]');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('should render with correct initial state when open', () => {
    const { container } = render(
      <CartDrawer isOpen={true} onClose={vi.fn()} />
    );

    const drawer = container.querySelector('[data-testid="cart-drawer"]');
    expect(drawer).toBeInTheDocument();
    expect(drawer).not.toHaveClass('translate-x-full');
  });

  it('should display empty state when cart has no items', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Empty Record Shelves')).toBeInTheDocument();
    expect(screen.getByText(/Your collection awaits/i)).toBeInTheDocument();
  });

  it('should display cart items when cart has items', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
    expect(screen.getByText('Three Cheers for Sweet Revenge')).toBeInTheDocument();
    expect(screen.getByText('$84.97')).toBeInTheDocument();
  });

  it('should display correct quantity for each item', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const quantities = screen.getAllByText(/^\d+$/);
    expect(quantities).toHaveLength(2);
    expect(quantities[0]).toHaveTextContent('2');
    expect(quantities[1]).toHaveTextContent('1');
  });

  it('should display correct price for each item', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$24.99')).toBeInTheDocument();
  });

  it('should call removeItem when remove button is clicked', async () => {
    const removeItem = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
      removeItem,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await userEvent.click(removeButtons[0]);

    expect(removeItem).toHaveBeenCalledWith('item-1');
  });

  it('should call updateQuantity when quantity is changed', async () => {
    const updateQuantity = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
      updateQuantity,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const incrementButtons = screen.getAllByRole('button', { name: /increment/i });
    await userEvent.click(incrementButtons[0]);

    expect(updateQuantity).toHaveBeenCalledWith('item-1', 3);
  });

  it('should call clearCart when clear all button is clicked', async () => {
    const clearCart = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
      clearCart,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await userEvent.click(clearButton);

    expect(clearCart).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<CartDrawer isOpen={true} onClose={onClose} />);

    const overlay = container.querySelector('[data-testid="cart-overlay"]');
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay!);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should show VinylSpinner when animationState is spinning', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      animationState: 'spinning',
      lastAddedItemId: 'item-1',
    });

    const { container } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const spinner = container.querySelector('[data-testid="vinyl-spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should not show VinylSpinner when animationState is idle', () => {
    const { container } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const spinner = container.querySelector('[data-testid="vinyl-spinner"]');
    expect(spinner).not.toBeInTheDocument();
  });

  it('should disable body scroll when open', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    const { unmount } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);
    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('should display item count in header', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display correct total price', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$84.97')).toBeInTheDocument();
  });

  it('should handle single item cart correctly', () => {
    const singleItem = [mockCartItems[0]];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: singleItem,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.queryByText('Three Cheers for Sweet Revenge')).not.toBeInTheDocument();
  });

  it('should handle zero quantity items gracefully', () => {
    const zeroQuantityItems = [
      { ...mockCartItems[0], quantity: 0 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: zeroQuantityItems,
      total: 0,
      itemCount: 0,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Empty Record Shelves')).toBeInTheDocument();
  });

  it('should handle very large quantities', () => {
    const largeQuantityItems = [
      { ...mockCartItems[0], quantity: 999 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: largeQuantityItems,
      total: 29969.01,
      itemCount: 999,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('$29969.01')).toBeInTheDocument();
  });

  it('should handle items with zero price', () => {
    const freeItems = [
      { ...mockCartItems[0], price: 0 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: freeItems,
      total: 0,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should handle items with very high price', () => {
    const expensiveItems = [
      { ...mockCartItems[0], price: 999999.99 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: expensiveItems,
      total: 1999999.98,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$999999.99')).toBeInTheDocument();
    expect(screen.getByText('$1999999.98')).toBeInTheDocument();
  });

  it('should handle items with missing imageUrl', () => {
    const itemsWithoutImage = [
      { ...mockCartItems[0], imageUrl: '' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: itemsWithoutImage,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with special characters in title', () => {
    const specialCharItems = [
      { ...mockCartItems[0], title: 'The Black Parade (Deluxe Edition) [Remastered]' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: specialCharItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade (Deluxe Edition) [Remastered]')).toBeInTheDocument();
  });

  it('should handle rapid add/remove operations', async () => {
    const removeItem = vi.fn();
    const updateQuantity = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
      removeItem,
      updateQuantity,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const incrementButtons = screen.getAllByRole('button', { name: /increment/i });

    await userEvent.click(removeButtons[0]);
    await userEvent.click(incrementButtons[0]);
    await userEvent.click(removeButtons[1]);

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(updateQuantity).toHaveBeenCalledTimes(1);
  });

  it('should handle animation state transitions', () => {
    const { rerender } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.queryByTestId('vinyl-spinner')).not.toBeInTheDocument();

    mockUseCart.mockReturnValue({
      ...defaultCartState,
      animationState: 'spinning',
      lastAddedItemId: 'item-1',
    });

    rerender(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('vinyl-spinner')).toBeInTheDocument();

    mockUseCart.mockReturnValue({
      ...defaultCartState,
      animationState: 'idle',
      lastAddedItemId: null,
    });

    rerender(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.queryByTestId('vinyl-spinner')).not.toBeInTheDocument();
  });

  it('should handle multiple items with same productId', () => {
    const duplicateProductItems = [
      { ...mockCartItems[0], id: 'item-1', productId: 'prod-1' },
      { ...mockCartItems[0], id: 'item-2', productId: 'prod-1' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: duplicateProductItems,
      total: 59.98,
      itemCount: 4,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const titles = screen.getAllByText('The Black Parade');
    expect(titles).toHaveLength(2);
  });

  it('should handle empty cart after having items', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    const { rerender } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();

    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: [],
      total: 0,
      itemCount: 0,
    });

    rerender(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Empty Record Shelves')).toBeInTheDocument();
    expect(screen.queryByText('The Black Parade')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation within drawer', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const drawer = screen.getByTestId('cart-drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
  });

  it('should handle focus trap when open', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(document.activeElement).toBe(closeButton);
  });

  it('should handle scroll position restoration on close', () => {
    const { unmount } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('should handle multiple close attempts', () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('should handle overlay click without closing when clicking inside drawer', async () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    const drawer = screen.getByTestId('cart-drawer');
    await userEvent.click(drawer);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should handle items with negative quantity gracefully', () => {
    const negativeQuantityItems = [
      { ...mockCartItems[0], quantity: -1 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: negativeQuantityItems,
      total: -29.99,
      itemCount: -1,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('-1')).toBeInTheDocument();
    expect(screen.getByText('-$29.99')).toBeInTheDocument();
  });

  it('should handle items with decimal quantities', () => {
    const decimalQuantityItems = [
      { ...mockCartItems[0], quantity: 2.5 },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: decimalQuantityItems,
      total: 74.975,
      itemCount: 2.5,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('$74.98')).toBeInTheDocument();
  });

  it('should handle items with null or undefined fields', () => {
    const incompleteItems = [
      {
        id: 'item-1',
        productId: 'prod-1',
        title: null,
        price: null,
        quantity: null,
        imageUrl: null,
      },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: incompleteItems,
      total: 0,
      itemCount: 0,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Empty Record Shelves')).toBeInTheDocument();
  });

  it('should handle very long item titles', () => {
    const longTitle = 'A'.repeat(200);
    const longTitleItems = [
      { ...mockCartItems[0], title: longTitle },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: longTitleItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should handle items with HTML entities in title', () => {
    const htmlEntityItems = [
      { ...mockCartItems[0], title: 'The Black Parade &amp; Three Cheers' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: htmlEntityItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade &amp; Three Cheers')).toBeInTheDocument();
  });

  it('should handle items with unicode characters in title', () => {
    const unicodeItems = [
      { ...mockCartItems[0], title: 'The Black Parade \u2665 Three Cheers' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: unicodeItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade \u2665 Three Cheers')).toBeInTheDocument();
  });

  it('should handle items with very long image URLs', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(500) + '.jpg';
    const longUrlItems = [
      { ...mockCartItems[0], imageUrl: longUrl },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: longUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with data URLs as image', () => {
    const dataUrlItems = [
      { ...mockCartItems[0], imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: dataUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with blob URLs as image', () => {
    const blobUrlItems = [
      { ...mockCartItems[0], imageUrl: 'blob:http://localhost:3000/12345678-1234-1234-1234-123456789012' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: blobUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with relative image paths', () => {
    const relativePathItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: relativePathItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with absolute image paths', () => {
    const absolutePathItems = [
      { ...mockCartItems[0], imageUrl: 'https://example.com/images/album.jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: absolutePathItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with protocol-relative image URLs', () => {
    const protocolRelativeItems = [
      { ...mockCartItems[0], imageUrl: '//example.com/images/album.jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: protocolRelativeItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with invalid image URLs', () => {
    const invalidUrlItems = [
      { ...mockCartItems[0], imageUrl: 'not-a-valid-url' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: invalidUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with empty image URLs', () => {
    const emptyUrlItems = [
      { ...mockCartItems[0], imageUrl: '' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: emptyUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with null image URLs', () => {
    const nullUrlItems = [
      { ...mockCartItems[0], imageUrl: null },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: nullUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with undefined image URLs', () => {
    const undefinedUrlItems = [
      { ...mockCartItems[0], imageUrl: undefined },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: undefinedUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with special characters in image URLs', () => {
    const specialCharUrlItems = [
      { ...mockCartItems[0], imageUrl: '/images/album [special] (2024).jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: specialCharUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with query parameters in image URLs', () => {
    const queryParamItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.jpg?w=800&h=800&fit=crop' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: queryParamItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with fragment identifiers in image URLs', () => {
    const fragmentItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.jpg#section' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: fragmentItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with encoded characters in image URLs', () => {
    const encodedUrlItems = [
      { ...mockCartItems[0], imageUrl: '/images/album%20cover%20%232024.jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: encodedUrlItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with multiple image formats', () => {
    const webpItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.webp' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: webpItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with SVG image URLs', () => {
    const svgItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.svg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: svgItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with GIF image URLs', () => {
    const gifItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.gif' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: gifItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with PNG image URLs', () => {
    const pngItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.png' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: pngItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with JPEG image URLs', () => {
    const jpegItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.jpeg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: jpegItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with JPG image URLs', () => {
    const jpgItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.jpg' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: jpgItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with AVIF image URLs', () => {
    const avifItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.avif' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: avifItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with TIFF image URLs', () => {
    const tiffItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.tiff' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: tiffItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with BMP image URLs', () => {
    const bmpItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.bmp' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: bmpItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with ICO image URLs', () => {
    const icoItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.ico' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: icoItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with WEBP image URLs', () => {
    const webpItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.webp' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: webpItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('should handle items with HEIC image URLs', () => {
    const heicItems = [
      { ...mockCartItems[0], imageUrl: '/images/album.heic' },
    ];
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: heicItems,
      total: 29.99,
      itemCount: 2,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);