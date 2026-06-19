<script setup lang="ts">
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
    expect(wrapper.find('[data-testid="cart-items"]').exists()).toBe(false);
  });

  it('should display cart items when cart has items', () => {
    const cartStore = useCartStore();
    const mockItems = createMockItems();
    cartStore.items = mockItems;
    cartStore.total = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartStore.itemCount = mockItems.reduce((sum, item) => sum + item.quantity, 0);

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="cart-items"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="cart-item"]')).toHaveLength(2);
  });

  it('should display correct total price', () => {
    const cartStore = useCartStore();
    const mockItems = createMockItems();
    const expectedTotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartStore.items = mockItems;
    cartStore.total = expectedTotal;
    cartStore.itemCount = mockItems.reduce((sum, item) => sum + item.quantity, 0);

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe(`$${expectedTotal.toFixed(2)}`);
  });

  it('should display correct item count', () => {
    const cartStore = useCartStore();
    const mockItems = createMockItems();
    const expectedCount = mockItems.reduce((sum, item) => sum + item.quantity, 0);
    cartStore.items = mockItems;
    cartStore.total = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartStore.itemCount = expectedCount;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-item-count"]').text()).toBe(String(expectedCount));
  });

  it('should emit close when overlay is clicked', async () => {
    const onClose = vi.fn();
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    await wrapper.find('[data-testid="cart-drawer-overlay"]').trigger('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should emit close when Escape key is pressed', async () => {
    const onClose = vi.fn();
    mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not emit close when other keys are pressed', async () => {
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

  it('should not emit close when Escape is pressed and drawer is closed', async () => {
    const onClose = vi.fn();
    mount(CartDrawer, {
      props: {
        isOpen: false,
        onClose,
      },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should apply animation class when isAnimating is true', async () => {
    const cartStore = useCartStore();
    cartStore.animationState = 'spinning';
    cartStore.items = createMockItems();
    cartStore.total = 84.97;
    cartStore.itemCount = 3;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    await nextTick();
    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).toContain('animate-spin');
  });

  it('should remove animation class after timeout', async () => {
    vi.useFakeTimers();
    const cartStore = useCartStore();
    cartStore.animationState = 'spinning';
    cartStore.items = createMockItems();
    cartStore.total = 84.97;
    cartStore.itemCount = 3;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    await nextTick();
    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).toContain('animate-spin');

    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).not.toContain('animate-spin');

    vi.useRealTimers();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should restore body overflow on unmount', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    document.body.style.overflow = 'hidden';
    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('should handle close button click', async () => {
    const onClose = vi.fn();
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    await wrapper.find('[data-testid="cart-drawer-close"]').trigger('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render with correct aria attributes', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-drawer"]').attributes('role')).toBe('dialog');
    expect(wrapper.find('[data-testid="cart-drawer"]').attributes('aria-modal')).toBe('true');
    expect(wrapper.find('[data-testid="cart-drawer"]').attributes('aria-label')).toBe('Shopping cart');
  });

  it('should handle single item cart correctly', () => {
    const cartStore = useCartStore();
    const singleItem = [createMockItems()[0]];
    cartStore.items = singleItem;
    cartStore.total = singleItem[0].price * singleItem[0].quantity;
    cartStore.itemCount = singleItem[0].quantity;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.findAll('[data-testid="cart-item"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe('$59.98');
    expect(wrapper.find('[data-testid="cart-item-count"]').text()).toBe('2');
  });

  it('should handle zero quantity items gracefully', () => {
    const cartStore = useCartStore();
    const zeroQuantityItem = {
      ...createMockItems()[0],
      quantity: 0,
    };
    cartStore.items = [zeroQuantityItem];
    cartStore.total = 0;
    cartStore.itemCount = 0;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe('$0.00');
    expect(wrapper.find('[data-testid="cart-item-count"]').text()).toBe('0');
  });

  it('should handle very large quantities', () => {
    const cartStore = useCartStore();
    const largeQuantityItem = {
      ...createMockItems()[0],
      quantity: 999,
    };
    cartStore.items = [largeQuantityItem];
    cartStore.total = largeQuantityItem.price * largeQuantityItem.quantity;
    cartStore.itemCount = largeQuantityItem.quantity;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-item-count"]').text()).toBe('999');
    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe('$29960.01');
  });

  it('should handle missing image URL gracefully', () => {
    const cartStore = useCartStore();
    const itemWithoutImage = {
      ...createMockItems()[0],
      imageUrl: '',
    };
    cartStore.items = [itemWithoutImage];
    cartStore.total = itemWithoutImage.price * itemWithoutImage.quantity;
    cartStore.itemCount = itemWithoutImage.quantity;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    const image = wrapper.find('[data-testid="cart-item-image"]');
    expect(image.attributes('src')).toBe('');
    expect(image.attributes('alt')).toBe(itemWithoutImage.title);
  });

  it('should handle items with zero price', () => {
    const cartStore = useCartStore();
    const freeItem = {
      ...createMockItems()[0],
      price: 0,
    };
    cartStore.items = [freeItem];
    cartStore.total = 0;
    cartStore.itemCount = freeItem.quantity;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe('$0.00');
  });

  it('should handle multiple items with same product ID', () => {
    const cartStore = useCartStore();
    const baseItem = createMockItems()[0];
    const duplicateItems = [
      { ...baseItem, id: 'item-1' },
      { ...baseItem, id: 'item-2' },
    ];
    cartStore.items = duplicateItems;
    cartStore.total = duplicateItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartStore.itemCount = duplicateItems.reduce((sum, item) => sum + item.quantity, 0);

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.findAll('[data-testid="cart-item"]')).toHaveLength(2);
    expect(wrapper.find('[data-testid="cart-total"]').text()).toBe('$119.96');
  });

  it('should handle rapid open/close transitions', async () => {
    const onClose = vi.fn();
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose,
      },
    });

    expect(wrapper.find('[data-testid="cart-drawer"]').exists()).toBe(true);

    await wrapper.setProps({ isOpen: false });
    expect(wrapper.find('[data-testid="cart-drawer"]').exists()).toBe(false);

    await wrapper.setProps({ isOpen: true });
    expect(wrapper.find('[data-testid="cart-drawer"]').exists()).toBe(true);
  });

  it('should not throw when onClose is not provided', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: undefined,
      },
    });

    expect(() => {
      wrapper.find('[data-testid="cart-drawer-overlay"]').trigger('click');
    }).not.toThrow();
  });

  it('should handle animation state changes correctly', async () => {
    const cartStore = useCartStore();
    cartStore.items = createMockItems();
    cartStore.total = 84.97;
    cartStore.itemCount = 3;

    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
      },
    });

    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).not.toContain('animate-spin');

    cartStore.animationState = 'spinning';
    await nextTick();
    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).toContain('animate-spin');

    cartStore.animationState = 'idle';
    await nextTick();
    expect(wrapper.find('[data-testid="cart-drawer"]').classes()).not.toContain('animate-spin');
  });
});
</script>