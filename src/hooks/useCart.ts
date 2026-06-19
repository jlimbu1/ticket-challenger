import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  function addItem(item: CartItem): void {
    const existingIndex = items.value.findIndex(
      (i) => i.productId === item.productId && i.id === item.id
    )
    if (existingIndex >= 0) {
      items.value[existingIndex].quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
    saveCartToStorage(items.value)
  }

  function removeItem(productId: string, ticketType?: string): void {
    if (ticketType) {
      items.value = items.value.filter(
        (item) => !(item.productId === productId && item.id === ticketType)
      )
    } else {
      items.value = items.value.filter((item) => item.productId !== productId)
    }
    saveCartToStorage(items.value)
  }

  function updateQuantity(productId: string, ticketType: string, quantity: number): void {
    const item = items.value.find(
      (i) => i.productId === productId && i.id === ticketType
    )
    if (item) {
      item.quantity = quantity
      saveCartToStorage(items.value)
    }
  }

  function clearCart(): void {
    items.value = []
    saveCartToStorage(items.value)
  }

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})