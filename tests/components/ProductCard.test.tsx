import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../src/components/ProductCard';
import { ProductGrid } from '../src/components/ProductGrid';
import { CartProvider } from '../src/hooks/useCart';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Product } from '../src/types';

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

  it('shows skull/rose overlay on hover', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    fireEvent.mouseEnter(card);
    
    const overlay = screen.getByTestId('hover-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.className).toContain('opacity-100');
    
    fireEvent.mouseLeave(card);
    expect(overlay.className).toContain('opacity-0');
  });

  it('shows crimson glow on hover', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    fireEvent.mouseEnter(card);
    
    expect(card.className).toContain('shadow-crimson-glow');
    
    fireEvent.mouseLeave(card);
    expect(card.className).not.toContain('shadow-crimson-glow');
  });

  it('renders add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDefined();
  });

  it('calls addToCart when add to cart button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Adding...')).toBeDefined();
  });

  it('shows out of stock state for unavailable products', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText(/out of stock/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('handles add to cart timeout error', () => {
    vi.useFakeTimers();
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    vi.advanceTimersByTime(10001);
    
    expect(screen.getByText(/failed to add to cart/i)).toBeDefined();
    
    vi.useRealTimers();
  });

  it('renders distressed texture background', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    expect(card.style.backgroundImage).toContain('data:image/svg+xml');
  });
});

describe('ProductGrid', () => {
  it('renders all products', () => {
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

  it('renders responsive grid layout', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    
    const grid = screen.getByTestId('product-grid');
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
    expect(grid.className).toContain('xl:grid-cols-4');
  });

  it('renders empty state when no products', () => {
    renderWithProviders(<ProductGrid products={[]} />);
    
    expect(screen.getByText(/the shelves are bare/i)).toBeDefined();
  });

  it('renders loading state', () => {
    renderWithProviders(<ProductGrid products={mockProducts} isLoading={true} />);
    
    expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
  });

  it('renders error state', () => {
    renderWithProviders(<ProductGrid products={mockProducts} error="Test error" />);
    
    expect(screen.getByText(/test error/i)).toBeDefined();
  });
});