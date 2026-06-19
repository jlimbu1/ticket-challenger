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
  <div
    v-if="props.isOpen"
    ref="drawerRef"
    class="fixed inset-0 z-50 flex justify-end"
    data-testid="cart-drawer"
  >
    <div
      class="fixed inset-0 bg-black/50 transition-opacity duration-300"
      :class="{ 'opacity-100': props.isOpen, 'opacity-0': !props.isOpen }"
      @click="handleClose"
    />
    <div
      class="relative w-full max-w-md bg-crimson-950 border-l border-crimson-800/50 shadow-2xl transform transition-transform duration-300"
      :class="{ 'translate-x-0': props.isOpen, 'translate-x-full': !props.isOpen }"
    >
      <div class="flex items-center justify-between p-4 border-b border-crimson-800/50">
        <h2 class="text-lg font-semibold text-crimson-100">
          Shopping Cart
          <span v-if="itemCount > 0" class="ml-2 text-sm text-crimson-400">
            ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
          </span>
        </h2>
        <button
          class="text-crimson-400 hover:text-crimson-200 transition-colors p-1"
          @click="handleClose"
          data-testid="cart-close-button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-2" style="max-height: calc(100vh - 180px);">
        <div v-if="items.length === 0">
          <EmptyStateComponent />
        </div>
        <div v-else>
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
      <div v-if="items.length > 0" class="border-t border-crimson-800/50 p-4 space-y-3">
        <div class="flex justify-between text-crimson-100">
          <span class="font-medium">Total</span>
          <span class="font-bold text-lg">${{ total.toFixed(2) }}</span>
        </div>
        <button
          class="w-full py-2 px-4 bg-crimson-600 hover:bg-crimson-500 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="items.length === 0"
          @click="handleCheckout"
          data-testid="checkout-button"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>