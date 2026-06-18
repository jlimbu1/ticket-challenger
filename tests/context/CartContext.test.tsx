"use client";

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/src/context/CartContext';
import type { Product } from '@/src/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  description: 'A test product',
  image: '/test.jpg',
  category: 'merch',
};

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  price: 49.99,
  description: 'Another test product',
  image: '/test2.jpg',
  category: 'vinyl',
};

function TestComponent() {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice } = useCart();

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total-price">{totalPrice.toFixed(2)}</div>
      <div data-testid="items-length">{items.length}</div>
      <button data-testid="add-item" onClick={() => addToCart(mockProduct)}>
        Add Item
      </button>
      <button data-testid="add-item-with-qty" onClick={() => addToCart(mockProduct, 3)}>
        Add Item with Qty
      </button>
      <button data-testid="add-second-item" onClick={() => addToCart(mockProduct2)}>
        Add Second Item
      </button>
      <button data-testid="remove-item" onClick={() => removeFromCart('1')}>
        Remove Item
      </button>
      <button data-testid="update-qty" onClick={() => updateQuantity('1', 5)}>
        Update Qty
      </button>
      <button data-testid="clear-cart" onClick={() => clearCart()}>
        Clear Cart
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.product.id} data-testid={`cart-item-${item.product.id}`}>
            {item.product.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with an empty cart', () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should add an item to the cart', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('29.99');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 1');
  });

  it('should add an item with a specific quantity', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item-with-qty'));
    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('total-price').textContent).toBe('89.97');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 3');
  });

  it('should increment quantity when adding an existing item', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-item'));
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('59.98');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 2');
  });

  it('should add multiple different items', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('79.98');
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 1');
    expect(screen.getByTestId('cart-item-2').textContent).toContain('Test Product 2 - 1');
  });

  it('should remove an item from the cart', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    fireEvent.click(screen.getByTestId('remove-item'));
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('49.99');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  it('should update quantity for an item', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 1');
    fireEvent.click(screen.getByTestId('update-qty'));
    expect(screen.getByTestId('item-count').textContent).toBe('5');
    expect(screen.getByTestId('total-price').textContent).toBe('149.95');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 5');
  });

  it('should remove item when updating quantity to zero', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    const updateToZeroButton = screen.getByText('Update Qty');
    fireEvent.click(updateToZeroButton);
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    const removeButton = screen.getByTestId('remove-item');
    fireEvent.click(removeButton);
    expect(screen.getByTestId('items-length').textContent).toBe('1');
  });

  it('should clear the entire cart', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    fireEvent.click(screen.getByTestId('clear-cart'));
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should persist cart state to localStorage', () => {
    const { unmount } = renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByTestId('add-item'));
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    unmount();
    const stored = localStorage.getItem('ticket-challenger-cart');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].product.id).toBe('1');
    expect(parsed[0].quantity).toBe(1);
  });

  it('should restore cart state from localStorage on mount', () => {
    const cartData = JSON.stringify([{ product: mockProduct, quantity: 2 }]);
    localStorage.setItem('ticket-challenger-cart', cartData);
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('59.98');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Test Product - 2');
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('ticket-challenger-cart', 'invalid json');
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should handle localStorage with missing product data gracefully', () => {
    const badData = JSON.stringify([{ product: null, quantity: 1 }]);
    localStorage.setItem('ticket-challenger-cart', badData);
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should handle localStorage with non-array data gracefully', () => {
    localStorage.setItem('ticket-challenger-cart', JSON.stringify({ product: mockProduct, quantity: 1 }));
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should throw error when useCart is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useCart must be used within a CartProvider');
    consoleSpy.mockRestore();
  });
});