<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import GothicButton from './GothicButton.vue'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: 'vinyl' | 'apparel' | 'poster' | 'accessory'
  stock: number
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  addToCart: [product: Product, quantity: number]
}>()

const cartStore = useCartStore()
const quantity = ref(1)
const isAdding = ref(false)
const imageError = ref(false)

const isInCart = computed(() => {
  return cartStore.items.some((item) => item.productId === props.product.id)
})

const cartQuantity = computed(() => {
  const item = cartStore.items.find((item) => item.productId === props.product.id)
  return item ? item.quantity : 0
})

const maxQuantity = computed(() => {
  return Math.min(props.product.stock, 10)
})

const canAddMore = computed(() => {
  return cartQuantity.value < props.product.stock
})

const formattedPrice = computed(() => {
  return `$${props.product.price.toFixed(2)}`
})

const stockLabel = computed(() => {
  if (props.product.stock === 0) return 'Out of Stock'
  if (props.product.stock <= 5) return `Only ${props.product.stock} left`
  return 'In Stock'
})

const stockLabelClass = computed(() => {
  if (props.product.stock === 0) return 'text-red-400'
  if (props.product.stock <= 5) return 'text-amber-400'
  return 'text-green-400'
})

const handleAddToCart = () => {
  if (quantity.value < 1 || quantity.value > maxQuantity.value) return
  if (!canAddMore.value) return

  isAdding.value = true

  cartStore.addItem({
    id: `${props.product.id}-${Date.now()}`,
    productId: props.product.id,
    title: props.product.name,
    price: props.product.price,
    quantity: quantity.value,
    imageUrl: props.product.image,
  })

  emit('addToCart', props.product, quantity.value)

  setTimeout(() => {
    isAdding.value = false
  }, 600)
}

const handleImageError = () => {
  imageError.value = true
}

const incrementQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div
    class="product-card group relative bg-crimson-950/80 border border-crimson-800/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-crimson-600/50 hover:shadow-lg hover:shadow-crimson-900/20"
    data-testid="product-card"
  >
    <div class="relative aspect-square overflow-hidden bg-crimson-900/40">
      <img
        v-if="!imageError && props.product.image"
        :src="props.product.image"
        :alt="props.product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="handleImageError"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-crimson-500/50"
      >
        <svg
          class="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>

      <div
        v-if="props.product.stock === 0"
        class="absolute inset-0 bg-black/60 flex items-center justify-center"
      >
        <span class="text-white text-lg font-semibold tracking-wider uppercase">
          Sold Out
        </span>
      </div>

      <div
        v-if="isAdding"
        class="absolute inset-0 bg-crimson-900/40 flex items-center justify-center"
      >
        <div class="w-8 h-8 border-2 border-crimson-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>

    <div class="p-4 space-y-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-crimson-100 font-semibold text-lg leading-tight line-clamp-2">
          {{ props.product.name }}
        </h3>
        <span
          class="text-crimson-300 font-mono text-lg font-bold whitespace-nowrap"
        >
          {{ formattedPrice }}
        </span>
      </div>

      <p
        v-if="props.product.description"
        class="text-crimson-400 text-sm line-clamp-2"
      >
        {{ props.product.description }}
      </p>

      <div class="flex items-center justify-between">
        <span
          :class="[
            'text-xs font-medium uppercase tracking-wider',
            stockLabelClass,
          ]"
        >
          {{ stockLabel }}
        </span>

        <span
          v-if="isInCart"
          class="text-xs text-crimson-400"
        >
          {{ cartQuantity }} in cart
        </span>
      </div>

      <div
        v-if="props.product.stock > 0"
        class="flex items-center gap-3"
      >
        <div class="flex items-center border border-crimson-800/50 rounded-md">
          <button
            class="px-2 py-1 text-crimson-300 hover:text-crimson-100 hover:bg-crimson-800/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="quantity <= 1"
            @click="decrementQuantity"
            aria-label="Decrease quantity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="px-3 py-1 text-crimron-100 font-mono text-sm min-w-[2rem] text-center">
            {{ quantity }}
          </span>
          <button
            class="px-2 py-1 text-crimson-300 hover:text-crimson-100 hover:bg-crimson-800/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="quantity >= maxQuantity"
            @click="incrementQuantity"
            aria-label="Increase quantity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <GothicButton
          variant="primary"
          size="sm"
          :disabled="!canAddMore || isAdding"
          class="flex-1"
          @click="handleAddToCart"
        >
          <span v-if="isAdding" class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </span>
          <span v-else-if="!canAddMore">Max in Cart</span>
          <span v-else>Add to Cart</span>
        </GothicButton>
      </div>
    </div>
  </div>
</template>