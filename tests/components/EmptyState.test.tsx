import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('renders with default poetic messages', () => {
    render(<EmptyState />);
    expect(screen.getByText('The Void Beckons')).toBeInTheDocument();
    expect(screen.getByText(/Like echoes in an empty cathedral/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Empty state');
  });

  it('renders custom title and message', () => {
    render(<EmptyState title="Nothing Here" message="This space is empty." />);
    expect(screen.getByText('Nothing Here')).toBeInTheDocument();
    expect(screen.getByText('This space is empty.')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const testIcon = <svg data-testid="custom-icon" />;
    render(<EmptyState icon={testIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when no icon prop is given', () => {
    const { container } = render(<EmptyState />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders action element when provided', () => {
    render(<EmptyState action={<button>Retry</button>} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState className="custom-class" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('custom-class');
  });
});