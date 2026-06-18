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

  it('should slide in when open', () => {
    const { container } = render(
      <CartDrawer isOpen={true} onClose={vi.fn()} />
    );

    const drawer = container.querySelector('[data-testid="cart-drawer"]');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('translate-x-0');
  });

  it('should display empty cart message with poetic text', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/The shelves are bare, the records silent/i)).toBeInTheDocument();
  });

  it('should display cart items when present', () => {
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

  it('should display item count in header', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<CartDrawer isOpen={true} onClose={onClose} />);

    const overlay = container.querySelector('[data-testid="cart-overlay"]');
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
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

    const quantityInputs = screen.getAllByRole('spinbutton');
    await userEvent.clear(quantityInputs[0]);
    await userEvent.type(quantityInputs[0], '3');

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

    expect(clearCart).toHaveBeenCalledTimes(1);
  });

  it('should show spinning animation when item is added', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
      animationState: 'spinning',
      lastAddedItemId: 'item-1',
    });

    const { container } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const spinningItem = container.querySelector('[data-testid="cart-item-spinning"]');
    expect(spinningItem).toBeInTheDocument();
  });

  it('should disable body scroll when open', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<CartDrawer isOpen={false} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('');
  });

  it('should not render overlay when closed', () => {
    const { container } = render(
      <CartDrawer isOpen={false} onClose={vi.fn()} />
    );

    const overlay = container.querySelector('[data-testid="cart-overlay"]');
    expect(overlay).not.toBeInTheDocument();
  });

  it('should display total price correctly with multiple items', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$84.97')).toBeInTheDocument();
  });

  it('should display total price as $0.00 when cart is empty', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should handle single item removal correctly', async () => {
    const removeItem = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: [mockCartItems[0]],
      total: 59.98,
      itemCount: 2,
      removeItem,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(removeButton);

    expect(removeItem).toHaveBeenCalledWith('item-1');
  });

  it('should handle quantity decrease to zero by removing item', async () => {
    const removeItem = vi.fn();
    const updateQuantity = vi.fn();
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: [mockCartItems[0]],
      total: 59.98,
      itemCount: 2,
      removeItem,
      updateQuantity,
    });

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const quantityInput = screen.getByRole('spinbutton');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '0');

    expect(removeItem).toHaveBeenCalledWith('item-1');
    expect(updateQuantity).not.toHaveBeenCalled();
  });

  it('should not call onClose when clicking inside drawer', async () => {
    const onClose = vi.fn();
    const { container } = render(<CartDrawer isOpen={true} onClose={onClose} />);

    const drawer = container.querySelector('[data-testid="cart-drawer"]');
    await userEvent.click(drawer!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render with correct aria attributes', () => {
    render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('aria-label', 'Shopping cart');
  });

  it('should handle rapid add/remove operations', async () => {
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
    await userEvent.click(removeButtons[1]);

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(removeItem).toHaveBeenCalledWith('item-1');
    expect(removeItem).toHaveBeenCalledWith('item-2');
  });

  it('should display correct item count in header when items change', () => {
    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: mockCartItems,
      total: 84.97,
      itemCount: 3,
    });

    const { rerender } = render(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/3/)).toBeInTheDocument();

    mockUseCart.mockReturnValue({
      ...defaultCartState,
      items: [mockCartItems[0]],
      total: 59.98,
      itemCount: 2,
    });

    rerender(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});