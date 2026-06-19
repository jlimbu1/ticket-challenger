<script setup lang="ts">
import { computed } from 'vue'

interface CartItemType {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  imageUrl: string
}

const props = defineProps<{
  item: CartItemType
  isAnimating: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  updateQuantity: [id: string, quantity: number]
}>()

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

const handleQuantityChange = (newQuantity: number): void => {
  if (newQuantity < 1) {
    emit('remove', props.item.id)
    return
  }
  emit('updateQuantity', props.item.id, newQuantity)
}

const itemTotal = computed(() => {
  return props.item.price * props.item.quantity
})
</script>

<template>
  <div class="cart-item border-b border-crimson-900/30 py-4 last:border-b-0">
    <div class="flex items-start gap-4">
      <div class="relative flex-shrink-0">
        <img
          :src="item.imageUrl"
          :alt="item.title"
          :class="[
            'w-16 h-16 object-cover rounded border border-crimson-800/50',
            { 'animate-spin': isAnimating }
          ]"
          data-testid="cart-item-image"
        />
        <div
          v-if="isAnimating"
          class="absolute inset-0 flex items-center justify-center bg-black/40 rounded"
        >
          <svg
            class="w-8 h-8 text-crimson-500 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <h3
          class="text-sm font-medium text-gray-100 truncate"
          data-testid="cart-item-title"
        >
          {{ item.title }}
        </h3>
        <p
          class="text-sm text-crimson-400 mt-1"
          data-testid="cart-item-price"
        >
          {{ formatPrice(item.price) }}
        </p>
        <div class="flex items-center gap-2 mt-2">
          <button
            class="w-7 h-7 flex items-center justify-center rounded border border-crimson-700/50 text-crimson-300 hover:bg-crimson-900/30 transition-colors"
            @click="handleQuantityChange(item.quantity - 1)"
            data-testid="cart-item-decrease"
            :aria-label="`Decrease quantity of ${item.title}`"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span
            class="text-sm text-gray-100 w-6 text-center"
            data-testid="cart-item-quantity"
          >
            {{ item.quantity }}
          </span>
          <button
            class="w-7 h-7 flex items-center justify-center rounded border border-crimson-700/50 text-crimson-300 hover:bg-crimson-900/30 transition-colors"
            @click="handleQuantityChange(item.quantity + 1)"
            data-testid="cart-item-increase"
            :aria-label="`Increase quantity of ${item.title}`"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <span
          class="text-sm font-medium text-gray-100"
          data-testid="cart-item-total"
        >
          {{ formatPrice(itemTotal) }}
        </span>
        <button
          class="text-crimson-400 hover:text-crimson-300 transition-colors"
          @click="emit('remove', item.id)"
          data-testid="cart-item-remove"
          :aria-label="`Remove ${item.title} from cart`"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>