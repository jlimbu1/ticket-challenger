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
    const img = screen.getByAltText('The Black Parade') as HTMLImageElement;
    expect(img.src).toContain('/images/black-parade.jpg');
  });

  it('shows skull/rose overlay on hover with crimson glow', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const card = screen.getByTestId('product-card');
    const overlay = screen.getByTestId('hover-overlay');
    expect(overlay.className).toContain('opacity-0');
    fireEvent.mouseEnter(card);
    expect(overlay.className).toContain('opacity-100');
    expect(card.className).toContain('shadow-crimson');
    fireEvent.mouseLeave(card);
    expect(overlay.className).toContain('opacity-0');
  });

  it('renders Add to Cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Add to Cart')).toBeDefined();
  });

  it('calls addToCart when Add to Cart is clicked', () => {
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
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
    vi.restoreAllMocks();
  });

  it('shows adding state when Add to Cart is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(screen.getByText('Adding...')).toBeDefined();
  });

  it('shows error state when add to cart fails', async () => {
    const addToCartSpy = vi.fn().mockRejectedValue(new Error('Failed'));
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
    fireEvent.click(screen.getByText('Add to Cart'));
    await screen.findByText('Failed to add to cart');
    expect(screen.getByText('Failed to add to cart')).toBeDefined();
    vi.restoreAllMocks();
  });

  it('shows out of stock state when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeDefined();
    expect(screen.queryByText('Add to Cart')).toBeNull();
  });

  it('applies distressed texture background', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const card = screen.getByTestId('product-card');
    expect(card.style.backgroundImage).toContain('data:image/svg+xml');
  });
});

describe('ProductGrid', () => {
  it('renders all products in a grid', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    expect(screen.getByText('The Black Parade')).toBeDefined();
    expect(screen.getByText('Three Cheers for Sweet Revenge')).toBeDefined();
    expect(screen.getByText('I Brought You My Bullets, You Brought Me Your Love')).toBeDefined();
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

  it('shows VinylSpinner when loading', () => {
    renderWithProviders(<ProductGrid products={[]} isLoading={true} />);
    expect(screen.getByTestId('vinyl-spinner')).toBeDefined();
  });

  it('shows EmptyState when no products', () => {
    renderWithProviders(<ProductGrid products={[]} />);
    expect(screen.getByText('The Record Collection is Empty')).toBeDefined();
    expect(screen.getByText('The shelves are bare, the music has faded. Perhaps the ghosts have taken our records. Check back when the spirits return.')).toBeDefined();
  });

  it('shows error state when error prop is provided', () => {
    renderWithProviders(<ProductGrid products={[]} error="Failed to load" />);
    expect(screen.getByText('The Record Player is Broken')).toBeDefined();
    expect(screen.getByText('A ghost in the machine has scattered our collection. The vinyls are silent, the needles are still. Perhaps refresh and try again?')).toBeDefined();
  });

  it('handles empty products array gracefully', () => {
    renderWithProviders(<ProductGrid products={[]} />);
    expect(screen.getByText('The Record Collection is Empty')).toBeDefined();
  });

  it('handles null products gracefully', () => {
    renderWithProviders(<ProductGrid products={null as unknown as Product[]} />);
    expect(screen.getByText('The Record Collection is Empty')).toBeDefined();
  });

  it('handles undefined products gracefully', () => {
    renderWithProviders(<ProductGrid products={undefined as unknown as Product[]} />);
    expect(screen.getByText('The Record Collection is Empty')).toBeDefined();
  });
});