import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GothicButton } from '@/components/GothicButton';

describe('GothicButton', () => {
  it('renders children text', () => {
    render(<GothicButton>Click Me</GothicButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<GothicButton>Primary</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-crimson');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<GothicButton variant="secondary">Secondary</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-deep-purple');
  });

  it('renders with danger variant', () => {
    const { container } = render(<GothicButton variant="danger">Danger</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-900');
  });

  it('renders with small size', () => {
    const { container } = render(<GothicButton size="sm">Small</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
  });

  it('renders with medium size', () => {
    const { container } = render(<GothicButton size="md">Medium</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-2.5');
    expect(button).toHaveClass('text-base');
  });

  it('renders with large size', () => {
    const { container } = render(<GothicButton size="lg">Large</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('py-3.5');
    expect(button).toHaveClass('text-lg');
  });

  it('fires onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<GothicButton onClick={handleClick}>Clickable</GothicButton>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<GothicButton disabled>Disabled</GothicButton>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('shows loading state and disables button', () => {
    render(<GothicButton isLoading loadingText="Processing...">Submit</GothicButton>);
    const button = screen.getByText('Processing...');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<GothicButton className="custom-class">Styled</GothicButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes additional HTML button props', () => {
    render(<GothicButton type="submit" data-testid="submit-btn">Submit</GothicButton>);
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });
});