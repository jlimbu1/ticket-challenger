<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps<{
  eventId: string
  eventName: string
  ticketType: string
  price: number
  quantity: number
  isAnimating: boolean
}>()

const emit = defineEmits<{
  remove: [eventId: string, ticketType: string]
  updateQuantity: [eventId: string, ticketType: string, quantity: number]
}>()

const cartStore = useCartStore()

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

const handleQuantityChange = (newQuantity: number): void => {
  if (newQuantity < 1) {
    emit('remove', props.eventId, props.ticketType)
    return
  }
  emit('updateQuantity', props.eventId, props.ticketType, newQuantity)
}

const itemTotal = computed(() => {
  return props.price * props.quantity
})
</script>

<template>
  <div class="cart-item border-b border-crimson-900/30 py-4 last:border-b-0">
    <div class="flex items-start gap-4">
      <div class="relative flex-shrink-0">
        <div
          :class="[
            'w-16 h-16 rounded border border-crimson-800/50 flex items-center justify-center bg-crimson-900/20 text-crimson-300 text-xs font-medium',
            { 'animate-pulse': isAnimating }
          ]"
          data-testid="cart-item-icon"
        >
          {{ eventName.charAt(0).toUpperCase() }}
        </div>
        <div
          v-if="isAnimating"
          class="absolute inset-0 flex items-center justify-center bg-black/40 rounded"
        >
          <svg
            class="w-5 h-5 text-crimson-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-crimson-100 truncate">
          {{ eventName }}
        </h3>
        <p class="text-xs text-crimson-400 mt-0.5">
          {{ ticketType }}
        </p>
        <p class="text-sm font-semibold text-crimson-200 mt-1">
          {{ formatPrice(itemTotal) }}
        </p>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="flex items-center gap-1">
          <button
            class="w-7 h-7 flex items-center justify-center rounded border border-crimson-700/50 text-crimson-300 hover:bg-crimson-800/30 hover:text-crimson-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="quantity <= 1"
            data-testid="decrement-button"
            @click="handleQuantityChange(quantity - 1)"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span
            class="w-8 text-center text-sm font-medium text-crimron-100"
            data-testid="quantity-display"
          >
            {{ quantity }}
          </span>
          <button
            class="w-7 h-7 flex items-center justify-center rounded border border-crimson-700/50 text-crimson-300 hover:bg-crimson-800/30 hover:text-crimson-100 transition-colors"
            data-testid="increment-button"
            @click="handleQuantityChange(quantity + 1)"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button
          class="text-xs text-crimson-500 hover:text-crimson-300 transition-colors"
          data-testid="remove-button"
          @click="emit('remove', props.eventId, props.ticketType)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>