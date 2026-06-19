import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  imageUrl: string
}

const CART_STORAGE_KEY = 'ticket-challenger-cart'

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
  return []
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage())
  const lastAddedItemId = ref<string | null>(null)

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems)
    },
    { deep: true }
  )

  function addItem(item: CartItem): void {
    if (!item.productId || !item.id) {
      console.error('CartItem must have productId and id')
      return
    }

    const existingIndex = items.value.findIndex(
      (i) => i.productId === item.productId && i.id === item.id
    )

    if (existingIndex !== -1) {
      const existingItem = items.value[existingIndex]
      const updatedItem: CartItem = {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity
      }
      const newItems = [
        ...items.value.slice(0, existingIndex),
        updatedItem,
        ...items.value.slice(existingIndex + 1)
      ]
      items.value = newItems
    } else {
      const newItem: CartItem = { ...item }
      items.value = [...items.value, newItem]
    }

    lastAddedItemId.value = item.id
  }

  function removeItem(productId: string, ticketType?: string): void {
    if (ticketType) {
      items.value = items.value.filter(
        (item) => !(item.productId === productId && item.title === ticketType)
      )
    } else {
      items.value = items.value.filter((item) => item.productId !== productId)
    }
  }

  function updateQuantity(productId: string, ticketType: string, quantity: number): void {
    const clampedQuantity = Math.max(1, quantity)
    const index = items.value.findIndex(
      (item) => item.productId === productId && item.title === ticketType
    )
    if (index !== -1) {
      const updatedItem: CartItem = {
        ...items.value[index],
        quantity: clampedQuantity
      }
      const newItems = [
        ...items.value.slice(0, index),
        updatedItem,
        ...items.value.slice(index + 1)
      ]
      items.value = newItems
    }
  }

  function clearCart(): void {
    items.value = []
    lastAddedItemId.value = null
  }

  return {
    items,
    lastAddedItemId,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})