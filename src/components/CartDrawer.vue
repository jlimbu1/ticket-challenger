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

const handleClose = () => {
  isAnimating.value = true
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
  animationTimer = setTimeout(() => {
    isAnimating.value = false
    emit('close')
  }, 300)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50"
      data-testid="cart-drawer"
    >
      <div
        class="fixed inset-0 bg-black/50 transition-opacity duration-300"
        :class="{ 'opacity-100': props.isOpen, 'opacity-0': !props.isOpen }"
        @click="handleClose"
        data-testid="cart-drawer-overlay"
      />
      <div
        ref="drawerRef"
        class="absolute top-0 right-0 h-full w-full max-w-md bg-crimson-950 border-l border-crimson-800/50 shadow-2xl transform transition-transform duration-300 flex flex-col"
        :class="{ 'translate-x-0': props.isOpen, 'translate-x-full': !props.isOpen }"
        data-testid="cart-drawer-panel"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-crimson-800/50">
          <h2 class="text-lg font-semibold text-crimson-100">
            Cart
            <span v-if="itemCount > 0" class="text-sm text-crimson-400 ml-2">
              ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
            </span>
          </h2>
          <button
            @click="handleClose"
            class="text-crimson-400 hover:text-crimson-200 transition-colors duration-200 p-1 rounded hover:bg-crimson-900/30"
            aria-label="Close cart"
            data-testid="cart-drawer-close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="items.length === 0" class="flex items-center justify-center h-full">
            <EmptyStateComponent
              title="Your cart is empty"
              message="Add some tickets to get started"
              data-testid="cart-empty-state"
            />
          </div>
          <div v-else class="space-y-1">
            <CartItemComponent
              v-for="item in items"
              :key="`${item.productId}-${item.id}`"
              :event-id="item.productId"
              :event-name="item.title"
              :ticket-type="item.id"
              :price="item.price"
              :quantity="item.quantity"
              :is-animating="isAnimating"
              @remove="handleRemoveItem"
              @update-quantity="handleUpdateQuantity"
              data-testid="cart-item"
            />
          </div>
        </div>

        <div v-if="items.length > 0" class="border-t border-crimson-800/50 px-6 py-4 space-y-4">
          <div class="flex items-center justify-between text-crimson-100">
            <span class="text-sm font-medium">Subtotal</span>
            <span class="text-lg font-bold">${{ total.toFixed(2) }}</span>
          </div>
          <button
            @click="handleCheckout"
            class="w-full py-3 px-6 bg-crimson-600 hover:bg-crimson-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-crimson-400 focus:ring-offset-2 focus:ring-offset-crimson-950 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="cart-checkout-button"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>