import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

const CART_STORAGE_KEY = 'ticket-challenger-cart'

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch { /* corrupted data — start fresh */ }
  return []
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch { /* storage full or unavailable */ }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadFromStorage())
  const lastAddedId = ref<string | null>(null)
  const badgeVisible = ref(false)

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  function _persist(): void {
    saveToStorage([...items.value])
  }

  function addItem(product: Product, quantity = 1): void {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product: { ...product }, quantity })
    }
    lastAddedId.value = product.id
    badgeVisible.value = true
    _persist()
    setTimeout(() => { badgeVisible.value = false }, 2000)
  }

  function removeItem(productId: string): void {
    const idx = items.value.findIndex(i => i.product.id === productId)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      _persist()
    }
  }

  function updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      _persist()
    }
  }

  function clearCart(): void {
    items.value = []
    badgeVisible.value = false
    _persist()
  }

  return {
    items, lastAddedId, badgeVisible,
    total, itemCount, isEmpty,
    addItem, removeItem, updateQuantity, clearCart,
  }
})
