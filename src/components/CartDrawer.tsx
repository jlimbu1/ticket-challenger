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
const animationState = computed(() => cartStore.animationState)
const lastAddedItemId = computed(() => cartStore.lastAddedItemId)

let animationTimer: ReturnType<typeof setTimeout> | null = null

watch(animationState, (newState) => {
  if (newState === 'spinning') {
    isAnimating.value = true
    animationTimer = setTimeout(() => {
      isAnimating.value = false
      animationTimer = null
    }, 1000)
  }
})

onUnmounted(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})

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
})

watch(() => props.isOpen, (newIsOpen) => {
  if (newIsOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleRemoveItem = (itemId: string) => {
  cartStore.removeItem(itemId)
}

const handleUpdateQuantity = (itemId: string, quantity: number) => {
  cartStore.updateQuantity(itemId, quantity)
}

const handleCheckout = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50 flex justify-end"
      data-testid="cart-drawer-overlay"
    >
      <div
        class="absolute inset-0 bg-black/50 transition-opacity duration-300"
        @click="handleOverlayClick"
      />
      <div
        ref="drawerRef"
        class="relative w-full max-w-md bg-crimson-950 border-l border-crimson-800/50 shadow-2xl transform transition-transform duration-300 ease-in-out"
        :class="props.isOpen ? 'translate-x-0' : 'translate-x-full'"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        data-testid="cart-drawer"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-crimson-800/50">
            <h2 class="text-xl font-bold text-crimson-100">
              Cart
              <span
                v-if="itemCount > 0"
                class="ml-2 text-sm font-normal text-crimson-400"
                data-testid="cart-item-count"
              >
                ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
              </span>
            </h2>
            <button
              class="text-crimson-400 hover:text-crimson-200 transition-colors p-1"
              @click="emit('close')"
              aria-label="Close cart"
              data-testid="cart-close-button"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div v-if="items.length === 0" data-testid="cart-empty-state">
              <EmptyStateComponent
                title="Your cart is empty"
                message="Add some items to get started"
                icon="cart"
                action="Browse Events"
              />
            </div>
            <div v-else class="space-y-2" data-testid="cart-items-list">
              <CartItemComponent
                v-for="item in items"
                :key="item.id"
                :item="item"
                :is-animating="isAnimating && item.id === lastAddedItemId"
                @remove="handleRemoveItem"
                @update-quantity="handleUpdateQuantity"
              />
            </div>
          </div>

          <div
            v-if="items.length > 0"
            class="border-t border-crimson-800/50 px-6 py-4 space-y-4"
            data-testid="cart-footer"
          >
            <div class="flex justify-between items-center text-lg">
              <span class="text-crimson-300">Total</span>
              <span class="font-bold text-crimson-100" data-testid="cart-total">
                ${{ total.toFixed(2) }}
              </span>
            </div>
            <button
              class="w-full bg-crimson-600 hover:bg-crimson-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="items.length === 0"
              @click="handleCheckout"
              data-testid="cart-checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>