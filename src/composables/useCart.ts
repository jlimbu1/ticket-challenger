import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

export function useCart() {
  const store = useCartStore()

  return {
    items: computed(() => store.items),
    total: computed(() => store.total),
    itemCount: computed(() => store.itemCount),
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}