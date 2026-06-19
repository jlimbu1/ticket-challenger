<script setup lang="ts">
import type { CartItem } from '@/types'

const props = defineProps<{
  item: CartItem
  isNew: boolean
}>()
const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'updateQuantity', qty: number): void
}>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded bg-gray-800/60 border border-red-900/20"
    :class="{ 'ring-1 ring-red-500/50': isNew }"
  >
    <img
      v-if="item.product.image"
      :src="item.product.image"
      :alt="item.product.name"
      class="w-12 h-12 rounded object-cover flex-shrink-0"
    />
    <div class="flex-1 min-w-0">
      <p class="text-gray-200 text-sm truncate">{{ item.product.name }}</p>
      <p class="text-red-400 text-xs">${{ item.product.price.toFixed(2) }} each</p>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="emit('updateQuantity', item.quantity - 1)"
        class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm"
        aria-label="Decrease quantity"
      >&minus;</button>
      <span class="text-gray-200 text-sm w-6 text-center">{{ item.quantity }}</span>
      <button
        @click="emit('updateQuantity', item.quantity + 1)"
        class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm"
        aria-label="Increase quantity"
      >+</button>
    </div>
    <button
      @click="emit('remove')"
      class="text-gray-500 hover:text-red-400 p-1"
      aria-label="Remove item"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
