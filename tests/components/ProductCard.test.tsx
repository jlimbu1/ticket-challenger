import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ProductCard } from '../src/components/ProductCard';
import { ProductGrid } from '../src/components/ProductGrid';
import { CartProvider } from '../src/hooks/useCart';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Product } from '../src/types';
import * as cartHook from '../src/hooks/useCart';

const mockProduct: Product = {
  id: '1',
  title: 'The Black Parade',
  artist: 'My Chemical Romance',
  price: 29.99,
  year: 2006,
  imageUrl: '/images/black-parade.jpg',
  description: 'The third studio album by My Chemical Romance',
  genre: 'Rock',
  inStock: true,
};

const mockProducts: Product[] = [
  mockProduct,
  {
    id: '2',
    title: 'Three Cheers for Sweet Revenge',
    artist: 'My Chemical Romance',
    price: 24.99,
    year: 2004,
    imageUrl: '/images/three-cheers.jpg',
    description: 'The second studio album',
    genre: 'Rock',
    inStock: true,
  },
  {
    id: '3',
    title: 'I Brought You My Bullets, You Brought Me Your Love',
    artist: 'My Chemical Romance',
    price: 19.99,
    year: 2002,
    imageUrl: '/images/bullets.jpg',
    description: 'The debut studio album',
    genre: 'Rock',
    inStock: false,
  },
];

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <CartProvider>
        {ui}
      </CartProvider>
    </ThemeProvider>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product title, price, year, and image', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('The Black Parade')).toBeDefined();
    expect(screen.getByText('$29.99')).toBeDefined();
    expect(screen.getByText('2006')).toBeDefined();
    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('/images/black-parade.jpg');
  });

  it('shows skull/rose overlay on hover with crimson glow', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    
    expect(card.className).not.toContain('shadow-crimson');
    
    fireEvent.mouseEnter(card);
    
    await waitFor(() => {
      expect(card.className).toContain('shadow-crimson');
    });
    
    const overlay = screen.getByTestId('hover-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.className).toContain('opacity-100');
    
    fireEvent.mouseLeave(card);
    
    await waitFor(() => {
      expect(card.className).not.toContain('shadow-crimson');
    });
  });

  it('renders add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDefined();
  });

  it('calls addToCart when add to cart button is clicked', async () => {
    const addToCartSpy = vi.fn();
    vi.spyOn(cartHook, 'useCart').mockReturnValue({
      items: [],
      addToCart: addToCartSpy,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    });

    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
  });

  it('shows out of stock state when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText(/out of stock/i)).toBeDefined();
    const addButton = screen.queryByRole('button', { name: /add to cart/i });
    expect(addButton).toBeNull();
  });

  it('shows loading spinner during add to cart', async () => {
    const addToCartSpy = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.spyOn(cartHook, 'useCart').mockReturnValue({
      items: [],
      addToCart: addToCartSpy,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    });

    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
    });
  });

  it('handles add to cart timeout error', async () => {
    vi.useFakeTimers();
    const addToCartSpy = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.spyOn(cartHook, 'useCart').mockReturnValue({
      items: [],
      addToCart: addToCartSpy,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    });

    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/failed to add to cart/i)).toBeDefined();
    });
    
    vi.useRealTimers();
  });
});

describe('ProductGrid', () => {
  it('renders all products as cards', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByText('The Black Parade')).toBeDefined();
    expect(screen.getByText('Three Cheers for Sweet Revenge')).toBeDefined();
    expect(screen.getByText('I Brought You My Bullets, You Brought Me Your Love')).toBeDefined();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderWithProviders(<ProductGrid products={[]} isLoading={true} />);
    
    expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
  });

  it('shows error state when error is provided', () => {
    renderWithProviders(<ProductGrid products={[]} error="Failed to load" />);
    
    expect(screen.getByText(/failed to load/i)).toBeDefined();
  });

  it('shows empty state when no products', () => {
    renderWithProviders(<ProductGrid products={[]} />);
    
    expect(screen.getByText(/empty/i)).toBeDefined();
  });

  it('renders responsive grid layout', () => {
    const { container } = renderWithProviders(<ProductGrid products={mockProducts} />);
    
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeDefined();
  });
});