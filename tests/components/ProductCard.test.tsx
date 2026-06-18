import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  it('renders product title, price, year, and image', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('The Black Parade')).toBeDefined();
    expect(screen.getByText('$29.99')).toBeDefined();
    expect(screen.getByText('2006')).toBeDefined();
    expect(screen.getByRole('img')).toBeDefined();
  });

  it('shows skull/rose overlay on hover with crimson glow', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    
    expect(card).toBeDefined();
    
    act(() => {
      fireEvent.mouseEnter(card);
    });
    
    const overlay = screen.getByTestId('hover-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.className).toContain('opacity-100');
    
    act(() => {
      fireEvent.mouseLeave(card);
    });
    
    expect(overlay.className).toContain('opacity-0');
  });

  it('renders add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDefined();
  });

  it('calls addToCart when add to cart button is clicked', () => {
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
    
    vi.restoreAllMocks();
  });

  it('shows out of stock state when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText(/out of stock/i)).toBeDefined();
    const addButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addButton).toBeDisabled();
  });

  it('shows adding state when add to cart is clicked', () => {
    vi.useFakeTimers();
    
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/adding/i)).toBeDefined();
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDefined();
    
    vi.useRealTimers();
  });

  it('handles add to cart timeout gracefully', () => {
    vi.useFakeTimers();
    
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDefined();
    
    vi.useRealTimers();
  });
});

describe('ProductGrid', () => {
  it('renders all products in a grid', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByText('The Black Parade')).toBeDefined();
    expect(screen.getByText('Three Cheers for Sweet Revenge')).toBeDefined();
    expect(screen.getByText('I Brought You My Bullets, You Brought Me Your Love')).toBeDefined();
  });

  it('renders correct number of product cards', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    
    const cards = screen.getAllByTestId('product-card');
    expect(cards.length).toBe(3);
  });

  it('renders loading state with VinylSpinner', () => {
    renderWithProviders(<ProductGrid products={[]} isLoading={true} />);
    
    expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
  });

  it('renders empty state when no products and not loading', () => {
    renderWithProviders(<ProductGrid products={[]} isLoading={false} />);
    
    expect(screen.getByText(/the shelves are bare/i)).toBeDefined();
  });

  it('renders error state when error is provided', () => {
    const errorMessage = 'Failed to load products';
    renderWithProviders(<ProductGrid products={[]} isLoading={false} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeDefined();
  });

  it('applies responsive grid classes', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
    expect(grid.className).toContain('xl:grid-cols-4');
  });

  it('handles empty products array without crashing', () => {
    renderWithProviders(<ProductGrid products={[]} isLoading={false} />);
    
    expect(screen.getByTestId('product-grid')).toBeDefined();
  });

  it('handles null products gracefully', () => {
    renderWithProviders(<ProductGrid products={null as unknown as Product[]} isLoading={false} />);
    
    expect(screen.getByText(/the shelves are bare/i)).toBeDefined();
  });
});