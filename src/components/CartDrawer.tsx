import { defineComponent, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

export default defineComponent({
  name: 'CartDrawer',
  setup() {
    const cartStore = useCartStore()

    const items = computed(() => cartStore.items)
    const total = computed(() => cartStore.total)
    const itemCount = computed(() => cartStore.itemCount)
    const lastAddedItemId = computed(() => cartStore.lastAddedItemId)

    function handleRemoveItem(productId: string, title: string) {
      cartStore.removeItem(productId, title)
    }

    function handleUpdateQuantity(productId: string, title: string, quantity: number) {
      cartStore.updateQuantity(productId, title, quantity)
    }

    function handleClearCart() {
      cartStore.clearCart()
    }

    function formatPrice(price: number): string {
      return `$${price.toFixed(2)}`
    }

    return () => (
      <div class="fixed inset-0 z-50 flex">
        <div class="absolute inset-0 bg-black/50" onClick={handleClearCart} />
        <div class="relative ml-auto w-full max-w-md bg-crimson-950 border-l border-crimson-800/50 shadow-2xl overflow-y-auto">
          <div class="sticky top-0 bg-crimson-950 z-10 p-4 border-b border-crimson-800/50">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-crimson-100">
                Cart ({itemCount.value} items)
              </h2>
              <button
                onClick={handleClearCart}
                class="text-crimson-400 hover:text-crimson-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {items.value.length === 0 && (
            <div class="p-8 text-center text-crimson-400">
              Your cart is empty.
            </div>
          )}

          {items.value.length > 0 && (
            <div class="divide-y divide-crimson-900/30">
              {items.value.map((item) => (
                <div key={`${item.productId}-${item.title}`} class="p-4 hover:bg-crimson-900/20 transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="w-16 h-16 rounded border border-crimson-800/50 flex items-center justify-center bg-crimson-900/20 text-crimson-300 text-xs font-medium flex-shrink-0">
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-crimson-100 truncate">
                        {item.title}
                      </h3>
                      <p class="text-xs text-crimson-400 mt-1">
                        {formatPrice(item.price)} each
                      </p>
                      <div class="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.title, item.quantity - 1)}
                          class="w-6 h-6 rounded border border-crimson-700/50 flex items-center justify-center text-crimson-300 hover:bg-crimson-800/50 transition-colors"
                        >
                          -
                        </button>
                        <span class="text-sm text-crimron-200 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.title, item.quantity + 1)}
                          class="w-6 h-6 rounded border border-crimson-700/50 flex items-center justify-center text-crimson-300 hover:bg-crimson-800/50 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.title)}
                          class="ml-auto text-crimson-400 hover:text-crimson-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div class="sticky bottom-0 bg-crimson-950 border-t border-crimson-800/50 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-crimson-300">Total</span>
              <span class="text-lg font-semibold text-crimson-100">
                {formatPrice(total.value)}
              </span>
            </div>
            <button
              disabled={items.value.length === 0}
              class="w-full py-2 px-4 rounded bg-crimson-600 text-white font-medium hover:bg-crimson-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }
})