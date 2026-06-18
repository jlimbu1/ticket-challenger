import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '../../app/cart/page';
import { CartProvider, useCart } from '../../src/context/CartContext';
import { Product } from '../../src/data/products';

jest.mock('../../src/context/CartContext', () => ({
  ...jest.requireActual('../../src/context/CartContext'),
  useCart: jest.fn(),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  description: 'A test product',
  image: '/test.jpg',
  category: 'test',
};

const mockCartItem = {
  product: mockProduct,
  quantity: 2,
};

const mockUseCart = {
  items: [mockCartItem],
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  totalItems: 2,
  totalPrice: 59.98,
};

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when cart has no items', () => {
    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText('Your Ritual Circle is Empty')).toBeInTheDocument();
    expect(screen.getByText('No items have been summoned yet. Browse the collection to begin.')).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('renders cart items when cart has items', () => {
    (useCart as jest.Mock).mockReturnValue(mockUseCart);

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$59.98')).toBeInTheDocument();
  });

  it('calls updateQuantity when increment button is clicked', () => {
    const updateQuantity = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      updateQuantity,
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    const incrementButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(incrementButton);

    expect(updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('calls updateQuantity when decrement button is clicked', () => {
    const updateQuantity = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      updateQuantity,
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    const decrementButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decrementButton);

    expect(updateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('calls removeItem when quantity goes to zero', () => {
    const updateQuantity = jest.fn();
    const removeItem = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      updateQuantity,
      removeItem,
      items: [{ product: mockProduct, quantity: 1 }],
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    const decrementButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decrementButton);

    expect(removeItem).toHaveBeenCalledWith('1');
    expect(updateQuantity).not.toHaveBeenCalled();
  });

  it('calls removeItem when remove button is clicked', () => {
    const removeItem = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      removeItem,
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.click(removeButton);

    expect(removeItem).toHaveBeenCalledWith('1');
  });

  it('renders total price correctly', () => {
    (useCart as jest.Mock).mockReturnValue(mockUseCart);

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText('Total: $59.98')).toBeInTheDocument();
  });

  it('renders proceed to checkout button with correct link', () => {
    (useCart as jest.Mock).mockReturnValue(mockUseCart);

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    const checkoutButton = screen.getByText('Proceed to Checkout');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout');
  });

  it('renders multiple cart items', () => {
    const secondProduct: Product = {
      id: '2',
      name: 'Second Product',
      price: 19.99,
      description: 'Another test product',
      image: '/test2.jpg',
      category: 'test',
    };

    (useCart as jest.Mock).mockReturnValue({
      ...mockUseCart,
      items: [
        mockCartItem,
        { product: secondProduct, quantity: 1 },
      ],
      totalItems: 3,
      totalPrice: 79.97,
    });

    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Second Product')).toBeInTheDocument();
    expect(screen.getByText('Total: $79.97')).toBeInTheDocument();
  });
});