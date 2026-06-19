import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import CartItem from '../../src/components/CartItem.vue';

interface CartItemType {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const createMockItem = (overrides: Partial<CartItemType> = {}): CartItemType => ({
  id: 'item-1',
  productId: 'prod-1',
  title: 'The Black Parade',
  price: 29.99,
  quantity: 2,
  imageUrl: '/images/black-parade.jpg',
  ...overrides,
});

describe('CartItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render item details correctly', () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-title"]').text()).toBe('The Black Parade');
    expect(wrapper.find('[data-testid="cart-item-price"]').text()).toBe('$29.99');
    expect(wrapper.find('[data-testid="cart-item-quantity"]').text()).toBe('2');
    expect(wrapper.find('[data-testid="cart-item-total"]').text()).toBe('$59.98');
    expect(wrapper.find('[data-testid="cart-item-image"]').attributes('src')).toBe('/images/black-parade.jpg');
    expect(wrapper.find('[data-testid="cart-item-image"]').attributes('alt')).toBe('The Black Parade');
  });

  it('should emit remove event when remove button is clicked', async () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-remove"]').trigger('click');

    expect(wrapper.emitted('remove')).toBeTruthy();
    expect(wrapper.emitted('remove')![0]).toEqual(['item-1']);
  });

  it('should emit updateQuantity event when quantity increases', async () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-increase"]').trigger('click');

    expect(wrapper.emitted('updateQuantity')).toBeTruthy();
    expect(wrapper.emitted('updateQuantity')![0]).toEqual(['item-1', 3]);
  });

  it('should emit updateQuantity event when quantity decreases', async () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-decrease"]').trigger('click');

    expect(wrapper.emitted('updateQuantity')).toBeTruthy();
    expect(wrapper.emitted('updateQuantity')![0]).toEqual(['item-1', 1]);
  });

  it('should emit remove event when quantity decreases below 1', async () => {
    const item = createMockItem({ quantity: 1 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-decrease"]').trigger('click');

    expect(wrapper.emitted('remove')).toBeTruthy();
    expect(wrapper.emitted('remove')![0]).toEqual(['item-1']);
  });

  it('should apply spinning animation when isAnimating is true', () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: true,
      },
    });

    const image = wrapper.find('[data-testid="cart-item-image"]');
    expect(image.classes()).toContain('animate-spin');
  });

  it('should not apply spinning animation when isAnimating is false', () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    const image = wrapper.find('[data-testid="cart-item-image"]');
    expect(image.classes()).not.toContain('animate-spin');
  });

  it('should format price correctly for whole numbers', () => {
    const item = createMockItem({ price: 30 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-price"]').text()).toBe('$30.00');
  });

  it('should format price correctly for decimal numbers', () => {
    const item = createMockItem({ price: 19.99 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-price"]').text()).toBe('$19.99');
  });

  it('should calculate item total correctly', () => {
    const item = createMockItem({ price: 25.50, quantity: 3 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-total"]').text()).toBe('$76.50');
  });

  it('should handle zero quantity gracefully', () => {
    const item = createMockItem({ quantity: 0 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-quantity"]').text()).toBe('0');
    expect(wrapper.find('[data-testid="cart-item-total"]').text()).toBe('$0.00');
  });

  it('should handle missing image URL gracefully', () => {
    const item = createMockItem({ imageUrl: '' });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    const image = wrapper.find('[data-testid="cart-item-image"]');
    expect(image.attributes('src')).toBe('');
    expect(image.attributes('alt')).toBe('The Black Parade');
  });

  it('should handle item with special characters in title', () => {
    const item = createMockItem({ title: 'Album & Song: "Greatest Hits" (2024)' });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-title"]').text()).toBe('Album & Song: "Greatest Hits" (2024)');
  });

  it('should handle very long item titles', () => {
    const longTitle = 'A'.repeat(200);
    const item = createMockItem({ title: longTitle });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-title"]').text()).toBe(longTitle);
  });

  it('should handle negative price gracefully', () => {
    const item = createMockItem({ price: -10 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-price"]').text()).toBe('$-10.00');
    expect(wrapper.find('[data-testid="cart-item-total"]').text()).toBe('$-20.00');
  });

  it('should handle very large quantity values', () => {
    const item = createMockItem({ quantity: 9999 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-quantity"]').text()).toBe('9999');
    expect(wrapper.find('[data-testid="cart-item-total"]').text()).toBe('$299,690.01');
  });

  it('should emit remove event with correct id when remove button is clicked multiple times', async () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-remove"]').trigger('click');
    await wrapper.find('[data-testid="cart-item-remove"]').trigger('click');

    expect(wrapper.emitted('remove')).toBeTruthy();
    expect(wrapper.emitted('remove')!.length).toBe(2);
    expect(wrapper.emitted('remove')![0]).toEqual(['item-1']);
    expect(wrapper.emitted('remove')![1]).toEqual(['item-1']);
  });

  it('should emit updateQuantity with correct values for multiple increments', async () => {
    const item = createMockItem({ quantity: 1 });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    await wrapper.find('[data-testid="cart-item-increase"]').trigger('click');
    await wrapper.find('[data-testid="cart-item-increase"]').trigger('click');
    await wrapper.find('[data-testid="cart-item-increase"]').trigger('click');

    expect(wrapper.emitted('updateQuantity')!.length).toBe(3);
    expect(wrapper.emitted('updateQuantity')![0]).toEqual(['item-1', 2]);
    expect(wrapper.emitted('updateQuantity')![1]).toEqual(['item-1', 3]);
    expect(wrapper.emitted('updateQuantity')![2]).toEqual(['item-1', 4]);
  });

  it('should not emit events when component is unmounted', async () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    wrapper.unmount();

    expect(wrapper.emitted('remove')).toBeUndefined();
    expect(wrapper.emitted('updateQuantity')).toBeUndefined();
  });

  it('should render with correct accessibility attributes', () => {
    const item = createMockItem();
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    const removeButton = wrapper.find('[data-testid="cart-item-remove"]');
    expect(removeButton.attributes('aria-label')).toBe('Remove item');
  });

  it('should handle item with empty id gracefully', () => {
    const item = createMockItem({ id: '' });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    expect(wrapper.find('[data-testid="cart-item-title"]').text()).toBe('The Black Parade');
  });

  it('should handle item with undefined optional fields gracefully', () => {
    const item = createMockItem({ imageUrl: undefined as unknown as string });
    const wrapper = mount(CartItem, {
      props: {
        item,
        isAnimating: false,
      },
    });

    const image = wrapper.find('[data-testid="cart-item-image"]');
    expect(image.attributes('src')).toBe('undefined');
  });
});