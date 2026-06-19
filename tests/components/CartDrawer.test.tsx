import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import CartDrawer from '../../src/components/CartDrawer.vue';
import { useCartStore } from '../../src/stores/cartStore';

const createMockItems = () => [
  {
    id: 'item-1',
    productId: 'prod-1',
    title: 'The Black Parade',
    price: 29.99,
    quantity: 2,
    imageUrl: '/images/black-parade.jpg',
  },
  {
    id: 'item-2',
    productId: 'prod-2',
    title: 'American Idiot',
    price: 24.99,
    quantity: 1,
    imageUrl: '/images/american-idiot.jpg',
  },
];

describe('CartDrawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-drawer"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="cart-drawer-overlay"]').exists()).toBe(true);
  });

  it('should not render when isOpen is false', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: false,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-drawer"]').exists()).toBe(false);
  });

  it('should display empty state when cart has no items', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="cart-item"]').exists()).toBe(false);
  });

  it('should display cart items when cart has items', () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
    const cartItems = wrapper.findAll('[data-testid="cart-item"]');
    expect(cartItems).toHaveLength(2);
  });

  it('should display correct total price', () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    const expectedTotal = (29.99 * 2) + (24.99 * 1);
    expect(wrapper.text()).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  it('should display correct item count', () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('3 items');
  });

  it('should emit close event when overlay is clicked', async () => {
    const onClose = vi.fn();
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    await wrapper.find('[data-testid="cart-drawer-overlay"]').trigger('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should emit close event when Escape key is pressed', async () => {
    const onClose = vi.fn();
    mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should not emit close event for non-Escape keys', async () => {
    const onClose = vi.fn();
    mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should remove item when remove is called', async () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    const removeButtons = wrapper.findAll('[data-testid="remove-item-button"]');
    await removeButtons[0].trigger('click');

    expect(store.items).toHaveLength(1);
    expect(store.items[0].productId).toBe('prod-2');
  });

  it('should update quantity when quantity control is used', async () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    const incrementButtons = wrapper.findAll('[data-testid="increment-quantity"]');
    await incrementButtons[0].trigger('click');

    const item = store.items.find((i) => i.productId === 'prod-1');
    expect(item?.quantity).toBe(3);
  });

  it('should remove item when quantity reaches 0', async () => {
    const store = useCartStore();
    store.addItem(createMockItems()[0]);

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    const decrementButtons = wrapper.findAll('[data-testid="decrement-quantity"]');
    await decrementButtons[0].trigger('click');
    await decrementButtons[0].trigger('click');

    expect(store.items).toHaveLength(0);
  });

  it('should lock body scroll when open', () => {
    mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should unlock body scroll when closed', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    await wrapper.setProps({ isOpen: false });
    expect(document.body.style.overflow).toBe('');
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should display formatted prices for each item', () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('$29.99');
    expect(wrapper.text()).toContain('$24.99');
  });

  it('should display item titles', () => {
    const store = useCartStore();
    const mockItems = createMockItems();
    mockItems.forEach((item) => store.addItem(item));

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('The Black Parade');
    expect(wrapper.text()).toContain('American Idiot');
  });

  it('should handle empty cart gracefully', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('$');
  });

  it('should handle single item cart correctly', () => {
    const store = useCartStore();
    store.addItem(createMockItems()[0]);

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('1 item');
    expect(wrapper.text()).toContain('$59.98');
  });

  it('should handle large quantities correctly', () => {
    const store = useCartStore();
    store.addItem({
      ...createMockItems()[0],
      quantity: 99,
    });

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('99 items');
    expect(wrapper.text()).toContain('$2,969.01');
  });

  it('should handle decimal prices correctly', () => {
    const store = useCartStore();
    store.addItem({
      id: 'item-3',
      productId: 'prod-3',
      title: 'Test Item',
      price: 9.99,
      quantity: 3,
      imageUrl: '/images/test.jpg',
    });

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain('$29.97');
  });

  it('should maintain scroll lock through multiple open/close cycles', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.setProps({ isOpen: false });
    expect(document.body.style.overflow).toBe('');

    await wrapper.setProps({ isOpen: true });
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should not throw when closed without items', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(() => wrapper.setProps({ isOpen: false })).not.toThrow();
  });
});