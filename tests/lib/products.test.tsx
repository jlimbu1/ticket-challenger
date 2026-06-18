import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';

const mockProduct: Product = {
  id: '1',
  name: 'The Black Parade',
  price: 29.99,
  description: 'A journey through the afterlife set to haunting melodies and thunderous drums. Limited edition crimson vinyl.',
  imageUrl: 'https://picsum.photos/seed/blackparade/400/400',
  category: 'Vinyl Records',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('The Black Parade')).toBeInTheDocument();
  });

  it('renders product price formatted with two decimals', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders product description', () => {
    render(<ProductCard product={mockProduct} />);
    expect(
      screen.getByText(
        'A journey through the afterlife set to haunting melodies and thunderous drums. Limited edition crimson vinyl.'
      )
    ).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'The Black Parade');
    expect(img).toHaveAttribute('src', expect.stringContaining('picsum.photos'));
  });

  it('renders product category', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Vinyl Records')).toBeInTheDocument();
  });

  it('renders nothing when product is null', () => {
    const { container } = render(<ProductCard product={null as unknown as Product} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when product has no name', () => {
    const invalidProduct = { ...mockProduct, name: '' };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when price is negative', () => {
    const invalidProduct = { ...mockProduct, price: -5 };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when price is not a number', () => {
    const invalidProduct = { ...mockProduct, price: NaN };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies hover effect classes', () => {
    render(<ProductCard product={mockProduct} />);
    const article = screen.getByRole('article');
    expect(article.className).toContain('group');
    expect(article.className).toContain('hover:scale-105');
  });

  it('renders overlay with skull SVG on hover', () => {
    render(<ProductCard product={mockProduct} />);
    const overlay = document.querySelector('[class*="opacity-0"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay?.innerHTML).toContain('svg');
  });

  it('renders distressed texture overlay', () => {
    render(<ProductCard product={mockProduct} />);
    const texture = document.querySelector('[class*="bg-repeat"]');
    expect(texture).toBeInTheDocument();
  });
});