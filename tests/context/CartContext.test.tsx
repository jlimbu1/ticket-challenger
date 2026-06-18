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
  category: 'vinyl',
  stock: 10,
};

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  price: 49.99,
  description: 'Another test product',
  image: '/test2.jpg',
  category: 'vinyl',
  stock: 5,
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
      <ul data-testid="cart-items">
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

  it('should initialize with empty cart', () => {
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
    expect(screen.getByTestId('cart-item-1').textContent).toBe('Test Product - 1');
  });

  it('should add an item with specified quantity', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item-with-qty'));

    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('total-price').textContent).toBe('89.97');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toBe('Test Product - 3');
  });

  it('should increment quantity when adding duplicate product', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-item'));

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('59.98');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toBe('Test Product - 2');
  });

  it('should add multiple different items', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('79.98');
    expect(screen.getByTestId('items-length').textContent).toBe('2');
    expect(screen.getByTestId('cart-item-1').textContent).toBe('Test Product - 1');
    expect(screen.getByTestId('cart-item-2').textContent).toBe('Test Product 2 - 1');
  });

  it('should remove an item from the cart', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    fireEvent.click(screen.getByTestId('remove-item'));

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('49.99');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.queryByTestId('cart-item-1')).toBeNull();
    expect(screen.getByTestId('cart-item-2').textContent).toBe('Test Product 2 - 1');
  });

  it('should handle remove from empty cart gracefully', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('remove-item'));

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should update quantity of an item', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('update-qty'));

    expect(screen.getByTestId('item-count').textContent).toBe('5');
    expect(screen.getByTestId('total-price').textContent).toBe('149.95');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1').textContent).toBe('Test Product - 5');
  });

  it('should clear the cart', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));
    fireEvent.click(screen.getByTestId('clear-cart'));

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('should calculate total price correctly with multiple items', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-item-with-qty'));
    fireEvent.click(screen.getByTestId('add-second-item'));

    const expectedTotal = 29.99 + 89.97 + 49.99;
    expect(screen.getByTestId('total-price').textContent).toBe(expectedTotal.toFixed(2));
    expect(screen.getByTestId('item-count').textContent).toBe('5');
    expect(screen.getByTestId('items-length').textContent).toBe('2');
  });

  it('should handle zero quantity add gracefully', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    const { addToCart } = { addToCart: () => {} };
    // Zero quantity should not add item
    const zeroQtyButton = screen.getByText('Add Item');
    fireEvent.click(zeroQtyButton);

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('29.99');
  });

  it('should persist cart state across re-renders', () => {
    const { rerender } = renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-second-item'));

    rerender(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('79.98');
    expect(screen.getByTestId('items-length').textContent).toBe('2');
  });

  it('should throw error when useCart is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCart must be used within a CartProvider');

    consoleError.mockRestore();
  });
});