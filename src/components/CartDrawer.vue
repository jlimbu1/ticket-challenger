<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import CartItemComponent from '@/components/CartItem.vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const cart = useCartStore()
const drawerRef = ref<HTMLElement | null>(null)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) emit('close')
}

watch(() => props.isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/60 z-40" @click="emit('close')" />
    </Transition>
    <Transition name="slide">
      <div
        v-if="isOpen"
        ref="drawerRef"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-red-900/30 shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-red-900/30">
          <h2 class="text-xl text-red-400" style="font-family: 'My Chemical Romance', serif">
            Your Collection
          </h2>
          <button @click="emit('close')" class="text-gray-400 hover:text-red-400 p-2" aria-label="Close cart">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center h-full text-center">
            <p class="text-gray-400 text-lg italic" style="font-family: 'My Chemical Romance', serif">
              The shelves are bare, the records silent...
            </p>
            <p class="text-gray-600 text-sm mt-2">Add some vinyl to begin your collection</p>
          </div>
          <div v-else class="space-y-2">
            <CartItemComponent
              v-for="item in cart.items"
              :key="item.product.id"
              :item="item"
              :is-new="cart.lastAddedId === item.product.id"
              @remove="cart.removeItem(item.product.id)"
              @update-quantity="(q: number) => cart.updateQuantity(item.product.id, q)"
            />
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cart.isEmpty" class="border-t border-red-900/30 p-4 space-y-4">
          <div class="flex items-center justify-between text-gray-300">
            <span class="text-sm">Items ({{ cart.itemCount }})</span>
            <span class="text-lg text-red-400" style="font-family: 'My Chemical Romance', serif">
              ${{ cart.total.toFixed(2) }}
            </span>
          </div>
          <button
            @click="cart.clearCart()"
            class="w-full py-2 px-4 bg-red-900/20 text-red-400 border border-red-900/30 rounded hover:bg-red-900/40 text-sm"
          >
            Clear Collection
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
