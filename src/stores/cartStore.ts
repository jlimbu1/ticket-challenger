<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import CartItemComponent from './CartItem.vue'
import EmptyStateComponent from './EmptyState.vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps<{
  isOpen: boolean
  onClose: () => void
}>()

const emit = defineEmits<{
  close: []
}>()

const cartStore = useCartStore()
const drawerRef = ref<HTMLDivElement | null>(null)
const isAnimating = ref(false)

const items = computed(() => cartStore.items)
const total = computed(() => cartStore.total)
const itemCount = computed(() => cartStore.itemCount)

let animationTimer: ReturnType<typeof setTimeout> | null = null

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})

watch(() => props.isOpen, (newIsOpen) => {
  if (newIsOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleRemoveItem = (eventId: string, ticketType: string) => {
  cartStore.removeItem(eventId, ticketType)
}

const handleUpdateQuantity = (eventId: string, ticketType: string, quantity: number) => {
  if (quantity < 1) {
    cartStore.removeItem(eventId, ticketType)
    return
  }
  cartStore.updateQuantity(eventId, ticketType, quantity)
}

const handleCheckout = () => {
  emit('close')
}
</script>

<template>
  <div>
    <Teleport to="body">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50"
        data-testid="cart-drawer-overlay"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('close')"
        />
        <div
          ref="drawerRef"
          class="absolute top-0 right-0 h-full w-full max-w-md bg-crimson-950 border-l border-crimson-800/50 shadow-2xl flex flex-col"
          data-testid="cart-drawer"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-crimson-800/30">
            <h2 class="text-xl font-semibold text-crimson-100">
              Your Cart
              <span v-if="itemCount > 0" class="text-sm text-crimson-400 ml-2">
                ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
              </span>
            </h2>
            <button
              class="text-crimson-400 hover:text-crimson-200 transition-colors p-2 rounded-lg hover:bg-crimson-900/50"
              @click="emit('close')"
              aria-label="Close cart"
              data-testid="cart-drawer-close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-crimson-400">
              <EmptyStateComponent
                title="Your cart is empty"
                message="Browse events and add tickets to get started."
              />
            </div>
            <div v-else class="space-y-2">
              <CartItemComponent
                v-for="item in items"
                :key="`${item.eventId}-${item.ticketType}`"
                :event-id="item.eventId"
                :event-name="item.eventName"
                :ticket-type="item.ticketType"
                :price="item.price"
                :quantity="item.quantity"
                :is-animating="isAnimating"
                @remove="handleRemoveItem"
                @update-quantity="handleUpdateQuantity"
              />
            </div>
          </div>

          <div v-if="items.length > 0" class="border-t border-crimson-800/30 px-6 py-4 space-y-4">
            <div class="flex justify-between items-center text-lg">
              <span class="text-crimson-300">Total</span>
              <span class="font-semibold text-crimson-100" data-testid="cart-total">
                ${{ total.toFixed(2) }}
              </span>
            </div>
            <button
              class="w-full py-3 px-6 bg-crimson-600 hover:bg-crimson-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-crimson-400 focus:ring-offset-2 focus:ring-offset-crimson-950 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleCheckout"
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>