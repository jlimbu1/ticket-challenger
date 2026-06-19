import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartBadge from '../../components/CartBadge';
import { CartContext, CartItem, CartState } from '../../src/hooks/useCart';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

function createTestState(items: CartItem[]): CartState {
  return {
    items,
    animationState: 'idle',
    lastAddedItemId: null,
  };
}

function renderWithCart(items: CartItem[]) {
  const dispatch = vi.fn();
  return render(
    <CartContext.Provider value={{ state: createTestState(items), dispatch }}>
      <CartBadge />
    </CartContext.Provider>
  );
}

const sampleItem: CartItem = {
  id: 'item-1',
  productId: 'prod-1',
  title: 'Test Product',
  price: 10.99,
  quantity: 2,
  imageUrl: '/test.jpg',
};

describe('CartBadge', () => {
  it('renders a link to /cart', () => {
    renderWithCart([]);
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/cart');
  });

  it('shows cart icon even when empty', () => {
    renderWithCart([]);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not show a count badge when cart is empty', () => {
    renderWithCart([]);
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).not.toBeInTheDocument();
  });

  it('shows count badge with total quantity when items exist', () => {
    renderWithCart([sampleItem]);
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('shows 99+ when count exceeds 99', () => {
    const manyItems: CartItem[] = Array.from({ length: 50 }, (_, i) => ({
      ...sampleItem,
      id: `item-${i}`,
      productId: `prod-${i}`,
      quantity: 2,
    }));
    renderWithCart(manyItems);
    const badge = screen.getByText('99+');
    expect(badge).toBeInTheDocument();
  });

  it('shows aggregated count from multiple items', () => {
    const items: CartItem[] = [
      { ...sampleItem, id: 'a', quantity: 3 },
      { ...sampleItem, id: 'b', quantity: 5 },
    ];
    renderWithCart(items);
    const badge = screen.getByText('8');
    expect(badge).toBeInTheDocument();
  });

  it('does not render badge SVG when count is zero', () => {
    renderWithCart([]);
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).not.toBeInTheDocument();
  });
});