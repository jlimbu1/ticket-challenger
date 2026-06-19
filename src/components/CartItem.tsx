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
          <svg class="animate-spin h-5 w-5 text-crimson-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-crimson-100 truncate" data-testid="cart-item-name">
          {{ eventName }}
        </h3>
        <p class="text-xs text-crimson-400 mt-0.5" data-testid="cart-item-type">
          {{ ticketType }}
        </p>
        <p class="text-sm font-medium text-crimson-200 mt-1" data-testid="cart-item-price">
          {{ formatPrice(price) }} each
        </p>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="flex items-center gap-2">
          <button
            @click="handleQuantityChange(quantity - 1)"
            class="w-7 h-7 rounded border border-crimson-700/50 flex items-center justify-center text-crimson-300 hover:bg-crimson-800/30 hover:text-crimson-100 transition-colors text-sm"
            aria-label="Decrease quantity"
            data-testid="cart-item-decrease"
          >
            -
          </button>
          <span class="text-sm font-medium text-crimson-100 w-6 text-center" data-testid="cart-item-quantity">
            {{ quantity }}
          </span>
          <button
            @click="handleQuantityChange(quantity + 1)"
            class="w-7 h-7 rounded border border-crimson-700/50 flex items-center justify-center text-crimson-300 hover:bg-crimson-800/30 hover:text-crimson-100 transition-colors text-sm"
            aria-label="Increase quantity"
            data-testid="cart-item-increase"
          >
            +
          </button>
        </div>
        <p class="text-sm font-semibold text-crimon-100" data-testid="cart-item-total">
          {{ formatPrice(itemTotal) }}
        </p>
        <button
          @click="emit('remove', props.eventId, props.ticketType)"
          class="text-xs text-crimson-400 hover:text-crimson-200 transition-colors underline"
          data-testid="cart-item-remove"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>