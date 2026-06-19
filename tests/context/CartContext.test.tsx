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
      <div data-testid="items-list">
        {items.map((item) => (
          <div key={item.product.id} data-testid={`item-${item.product.id}`}>
            <span data-testid={`item-name-${item.product.id}`}>{item.product.name}</span>
            <span data-testid={`item-qty-${item.product.id}`}>{item.quantity}</span>
            <span data-testid={`item-price-${item.product.id}`}>{item.product.price}</span>
          </div>
        ))}
      </div>
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

  describe('initial state', () => {
    it('should start with empty cart', () => {
      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('item-count').textContent).toBe('0');
      expect(screen.getByTestId('total-price').textContent).toBe('0.00');
      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should restore cart from localStorage on mount', () => {
      const storedItems = [
        {
          product: mockProduct,
          quantity: 2,
        },
      ];
      localStorage.setItem('ticket-challenger-cart', JSON.stringify(storedItems));

      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('item-count').textContent).toBe('2');
      expect(screen.getByTestId('total-price').textContent).toBe('59.98');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('ticket-challenger-cart', 'invalid json');

      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('item-count').textContent).toBe('0');
      expect(screen.getByTestId('total-price').textContent).toBe('0.00');
      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should handle null localStorage gracefully', () => {
      localStorage.setItem('ticket-challenger-cart', 'null');

      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('item-count').textContent).toBe('0');
      expect(screen.getByTestId('total-price').textContent).toBe('0.00');
      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });
  });

  describe('addToCart', () => {
    it('should add a single item to the cart', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));

      expect(screen.getByTestId('item-count').textContent).toBe('1');
      expect(screen.getByTestId('total-price').textContent).toBe('29.99');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should add item with specified quantity', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item-with-qty'));

      expect(screen.getByTestId('item-count').textContent).toBe('3');
      expect(screen.getByTestId('total-price').textContent).toBe('89.97');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should increment quantity when adding duplicate item', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-item'));

      expect(screen.getByTestId('item-count').textContent).toBe('2');
      expect(screen.getByTestId('total-price').textContent).toBe('59.98');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should add multiple different items', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-second-item'));

      expect(screen.getByTestId('item-count').textContent).toBe('2');
      expect(screen.getByTestId('total-price').textContent).toBe('79.98');
      expect(screen.getByTestId('items-length').textContent).toBe('2');
    });

    it('should persist cart to localStorage after adding item', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));

      const stored = localStorage.getItem('ticket-challenger-cart');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].product.id).toBe('1');
      expect(parsed[0].quantity).toBe(1);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      expect(screen.getByTestId('items-length').textContent).toBe('1');

      fireEvent.click(screen.getByTestId('remove-item'));
      expect(screen.getByTestId('items-length').textContent).toBe('0');
      expect(screen.getByTestId('item-count').textContent).toBe('0');
      expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    });

    it('should update total price correctly after removal', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-second-item'));
      expect(screen.getByTestId('total-price').textContent).toBe('79.98');

      fireEvent.click(screen.getByTestId('remove-item'));
      expect(screen.getByTestId('total-price').textContent).toBe('49.99');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should not throw error when removing from empty cart', () => {
      renderWithProvider(<TestComponent />);

      expect(() => {
        fireEvent.click(screen.getByTestId('remove-item'));
      }).not.toThrow();

      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should not throw error when removing non-existent item', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-second-item'));

      expect(() => {
        fireEvent.click(screen.getByTestId('remove-item'));
      }).not.toThrow();

      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should persist cart to localStorage after removal', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('remove-item'));

      const stored = localStorage.getItem('ticket-challenger-cart');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of an item', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      expect(screen.getByTestId('item-count').textContent).toBe('1');

      fireEvent.click(screen.getByTestId('update-qty'));
      expect(screen.getByTestId('item-count').textContent).toBe('5');
      expect(screen.getByTestId('total-price').textContent).toBe('149.95');
    });

    it('should remove item when quantity set to 0', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      expect(screen.getByTestId('items-length').textContent).toBe('1');

      fireEvent.click(screen.getByTestId('update-qty'));
      expect(screen.getByTestId('items-length').textContent).toBe('1');

      const updateToZeroButton = screen.getByText('Update Qty');
      fireEvent.click(updateToZeroButton);
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should not throw error when updating quantity of non-existent item', () => {
      renderWithProvider(<TestComponent />);

      expect(() => {
        fireEvent.click(screen.getByTestId('update-qty'));
      }).not.toThrow();

      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should persist cart to localStorage after quantity update', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('update-qty'));

      const stored = localStorage.getItem('ticket-challenger-cart');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed[0].quantity).toBe(5);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-second-item'));
      expect(screen.getByTestId('items-length').textContent).toBe('2');

      fireEvent.click(screen.getByTestId('clear-cart'));
      expect(screen.getByTestId('items-length').textContent).toBe('0');
      expect(screen.getByTestId('item-count').textContent).toBe('0');
      expect(screen.getByTestId('total-price').textContent).toBe('0.00');
    });

    it('should not throw error when clearing empty cart', () => {
      renderWithProvider(<TestComponent />);

      expect(() => {
        fireEvent.click(screen.getByTestId('clear-cart'));
      }).not.toThrow();

      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should clear localStorage after clearing cart', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('clear-cart'));

      const stored = localStorage.getItem('ticket-challenger-cart');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('persistence across re-renders', () => {
    it('should maintain cart state after re-render', () => {
      const { rerender } = render(<CartProvider><TestComponent /></CartProvider>);

      fireEvent.click(screen.getByTestId('add-item'));
      expect(screen.getByTestId('items-length').textContent).toBe('1');

      rerender(<CartProvider><TestComponent /></CartProvider>);

      expect(screen.getByTestId('items-length').textContent).toBe('1');
      expect(screen.getByTestId('item-count').textContent).toBe('1');
      expect(screen.getByTestId('total-price').textContent).toBe('29.99');
    });

    it('should restore cart from localStorage on new provider mount', () => {
      const { unmount } = render(<CartProvider><TestComponent /></CartProvider>);

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-second-item'));

      unmount();

      render(<CartProvider><TestComponent /></CartProvider>);

      expect(screen.getByTestId('items-length').textContent).toBe('2');
      expect(screen.getByTestId('item-count').textContent).toBe('2');
      expect(screen.getByTestId('total-price').textContent).toBe('79.98');
    });
  });

  describe('edge cases', () => {
    it('should handle localStorage quota exceeded gracefully', () => {
      const setItemMock = vi.spyOn(Storage.prototype, 'setItem');
      setItemMock.mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      renderWithProvider(<TestComponent />);

      expect(() => {
        fireEvent.click(screen.getByTestId('add-item'));
      }).not.toThrow();

      expect(screen.getByTestId('items-length').textContent).toBe('1');

      setItemMock.mockRestore();
    });

    it('should handle localStorage getItem throwing error', () => {
      const getItemMock = vi.spyOn(Storage.prototype, 'getItem');
      getItemMock.mockImplementation(() => {
        throw new Error('Storage error');
      });

      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('items-length').textContent).toBe('0');
      expect(screen.getByTestId('item-count').textContent).toBe('0');

      getItemMock.mockRestore();
    });

    it('should handle adding item with quantity 0', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('add-item-with-qty'));
      expect(screen.getByTestId('items-length').textContent).toBe('1');
      expect(screen.getByTestId('item-count').textContent).toBe('3');
    });

    it('should handle adding item with negative quantity', () => {
      renderWithProvider(<TestComponent />);

      const addNegativeButton = screen.getByText('Add Item with Qty');
      fireEvent.click(addNegativeButton);
      expect(screen.getByTestId('items-length').textContent).toBe('1');
      expect(screen.getByTestId('item-count').textContent).toBe('3');
    });
  });
});