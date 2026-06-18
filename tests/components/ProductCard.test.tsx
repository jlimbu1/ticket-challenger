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
    expect(screen.getByAltText('The Black Parade')).toBeDefined();
  });

  it('shows skull/rose overlay on hover with crimson glow', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    expect(card).toBeDefined();
    
    fireEvent.mouseEnter(card);
    
    const overlay = screen.getByTestId('hover-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.className).toContain('opacity-100');
    
    fireEvent.mouseLeave(card);
    
    expect(overlay.className).toContain('opacity-0');
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
    
    expect(screen.getByText('Added')).toBeDefined();
  });

  it('shows out of stock state when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText(/out of stock/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });
});

describe('ProductGrid', () => {
  it('renders loading state initially', () => {
    renderWithProviders(<ProductGrid />);
    
    expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
  });

  it('renders products after loading', async () => {
    renderWithProviders(<ProductGrid />);
    
    const productCards = await screen.findAllByTestId('product-card');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('renders empty state when no products', async () => {
    vi.mock('../src/data/mockData', () => ({
      getProducts: vi.fn().mockResolvedValue([]),
    }));
    
    renderWithProviders(<ProductGrid />);
    
    const emptyState = await screen.findByTestId('empty-state');
    expect(emptyState).toBeDefined();
  });

  it('renders error state when fetch fails', async () => {
    vi.mock('../src/data/mockData', () => ({
      getProducts: vi.fn().mockRejectedValue(new Error('Failed to load')),
    }));
    
    renderWithProviders(<ProductGrid />);
    
    const errorState = await screen.findByTestId('empty-state');
    expect(errorState).toBeDefined();
    expect(screen.getByText(/the record player is broken/i)).toBeDefined();
  });
});