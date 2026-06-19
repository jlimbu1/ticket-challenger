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

    const existingItem = items.value.find(
      (i) => i.productId === item.productId && i.id === item.id
    )

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push({ ...item })
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

    const item = items.value.find(
      (i) => i.productId === productId && i.title === ticketType
    )

    if (item) {
      item.quantity = clampedQuantity
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
    clearCart,
  }
})