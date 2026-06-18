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

  it('applies hover effect classes on the article element', () => {
    render(<ProductCard product={mockProduct} />);
    const article = screen.getByRole('article');
    expect(article.className).toContain('hover:scale-105');
    expect(article.className).toContain('transition-transform');
    expect(article.className).toContain('duration-500');
  });

  it('renders the skull/rose overlay SVG on hover', () => {
    render(<ProductCard product={mockProduct} />);
    const overlay = screen.getByTestId('skull-rose-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.className).toContain('opacity-0');
    expect(overlay.className).toContain('group-hover:opacity-100');
  });

  it('renders null when product is undefined', () => {
    const { container } = render(<ProductCard product={undefined as unknown as Product} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when product name is empty', () => {
    const invalidProduct: Product = { ...mockProduct, name: '' };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when product price is negative', () => {
    const invalidProduct: Product = { ...mockProduct, price: -5 };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when product price is not a number', () => {
    const invalidProduct: Product = { ...mockProduct, price: NaN };
    const { container } = render(<ProductCard product={invalidProduct} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the distressed texture overlay', () => {
    render(<ProductCard product={mockProduct} />);
    const texture = screen.getByTestId('distressed-texture');
    expect(texture).toBeInTheDocument();
    expect(texture.className).toContain('opacity-0');
    expect(texture.className).toContain('group-hover:opacity-30');
  });

  it('renders the crimson overlay on hover', () => {
    render(<ProductCard product={mockProduct} />);
    const overlay = screen.getByTestId('color-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.className).toContain('opacity-0');
    expect(overlay.className).toContain('group-hover:opacity-40');
  });
});