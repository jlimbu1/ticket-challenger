import React from 'react';
import { render, screen } from '@testing-library/react';
import { VinylSpinner } from '@/components/VinylSpinner';

describe('VinylSpinner', () => {
  it('renders with default props', () => {
    render(<VinylSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom label', () => {
    render(<VinylSpinner label="Adding to cart..." />);
    expect(screen.getByText('Adding to cart...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Adding to cart...');
  });

  it('renders with small size', () => {
    const { container } = render(<VinylSpinner size="sm" />);
    const vinylDisc = container.querySelector('.animate-spin-vinyl');
    expect(vinylDisc).toHaveClass('w-12');
    expect(vinylDisc).toHaveClass('h-12');
  });

  it('renders with medium size', () => {
    const { container } = render(<VinylSpinner size="md" />);
    const vinylDisc = container.querySelector('.animate-spin-vinyl');
    expect(vinylDisc).toHaveClass('w-20');
    expect(vinylDisc).toHaveClass('h-20');
  });

  it('renders with large size', () => {
    const { container } = render(<VinylSpinner size="lg" />);
    const vinylDisc = container.querySelector('.animate-spin-vinyl');
    expect(vinylDisc).toHaveClass('w-32');
    expect(vinylDisc).toHaveClass('h-32');
  });

  it('applies custom className', () => {
    const { container } = render(<VinylSpinner className="my-custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('my-custom-class');
  });

  it('does not render label text when no label prop is provided', () => {
    render(<VinylSpinner />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders the vinyl disc with correct structure', () => {
    const { container } = render(<VinylSpinner />);
    const vinylDisc = container.querySelector('.animate-spin-vinyl');
    expect(vinylDisc).toBeInTheDocument();
    expect(vinylDisc?.querySelectorAll('.rounded-full').length).toBeGreaterThanOrEqual(4);
  });

  it('renders the center label with crimson background', () => {
    const { container } = render(<VinylSpinner />);
    const centerLabel = container.querySelector('.bg-crimson');
    expect(centerLabel).toBeInTheDocument();
  });
});