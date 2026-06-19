import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../../src/stores/cartStore'

describe('cartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initial state', () => {
    it('starts with an empty cart', () => {
      const store = useCartStore()
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
      expect(store.lastAddedItemId).toBeNull()
    })

    it('loads persisted items from localStorage', () => {
      const persistedItems = [
        {
          id: '1',
          productId: 'p1',
          title: 'Test Ticket',
          price: 25,
          quantity: 2,
          imageUrl: '/test.jpg',
        },
      ]
      localStorage.setItem('ticket-challenger-cart', JSON.stringify(persistedItems))

      const store = useCartStore()
      expect(store.items).toEqual(persistedItems)
      expect(store.total).toBe(50)
      expect(store.itemCount).toBe(2)
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('ticket-challenger-cart', 'invalid json')

      const store = useCartStore()
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
    })

    it('handles non-array localStorage gracefully', () => {
      localStorage.setItem('ticket-challenger-cart', JSON.stringify({ not: 'an array' }))

      const store = useCartStore()
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
    })
  })

  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      }

      store.addItem(item)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]).toEqual(item)
      expect(store.total).toBe(50)
      expect(store.itemCount).toBe(2)
      expect(store.lastAddedItemId).toBe('1')
    })

    it('increments quantity when adding an existing item', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      }

      store.addItem(item)
      store.addItem({ ...item, quantity: 3 })

      expect(store.items).toHaveLength(1)
      expect(store.items[0].quantity).toBe(5)
      expect(store.total).toBe(125)
      expect(store.itemCount).toBe(5)
    })

    it('does not mutate the original item object', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      }

      store.addItem(item)
      expect(store.items[0]).not.toBe(item)
    })

    it('does not add item without productId', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        productId: '',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      }

      store.addItem(item)
      expect(store.items).toHaveLength(0)
    })

    it('does not add item without id', () => {
      const store = useCartStore()
      const item = {
        id: '',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      }

      store.addItem(item)
      expect(store.items).toHaveLength(0)
    })
  })

  describe('removeItem', () => {
    it('removes an item by productId', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.addItem({
        id: '2',
        productId: 'p2',
        title: 'VIP',
        price: 50,
        quantity: 1,
        imageUrl: '/vip.jpg',
      })

      store.removeItem('p1')

      expect(store.items).toHaveLength(1)
      expect(store.items[0].productId).toBe('p2')
      expect(store.total).toBe(50)
      expect(store.itemCount).toBe(1)
    })

    it('removes a specific ticket type when ticketType is provided', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.addItem({
        id: '2',
        productId: 'p1',
        title: 'VIP',
        price: 50,
        quantity: 1,
        imageUrl: '/vip.jpg',
      })

      store.removeItem('p1', 'General Admission')

      expect(store.items).toHaveLength(1)
      expect(store.items[0].title).toBe('VIP')
      expect(store.total).toBe(50)
      expect(store.itemCount).toBe(1)
    })

    it('does nothing when removing a non-existent item', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.removeItem('nonexistent')

      expect(store.items).toHaveLength(1)
      expect(store.total).toBe(50)
      expect(store.itemCount).toBe(2)
    })

    it('handles removing from empty cart', () => {
      const store = useCartStore()
      store.removeItem('p1')
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity for an existing item', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.updateQuantity('p1', 'General Admission', 5)

      expect(store.items[0].quantity).toBe(5)
      expect(store.total).toBe(125)
      expect(store.itemCount).toBe(5)
    })

    it('clamps quantity to minimum of 1', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.updateQuantity('p1', 'General Admission', 0)

      expect(store.items[0].quantity).toBe(1)
      expect(store.total).toBe(25)
      expect(store.itemCount).toBe(1)
    })

    it('clamps negative quantity to 1', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.updateQuantity('p1', 'General Admission', -5)

      expect(store.items[0].quantity).toBe(1)
    })

    it('does nothing when item does not exist', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.updateQuantity('nonexistent', 'General Admission', 5)

      expect(store.items).toHaveLength(1)
      expect(store.items[0].quantity).toBe(2)
    })

    it('does nothing when ticket type does not match', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      store.updateQuantity('p1', 'VIP', 5)

      expect(store.items[0].quantity).toBe(2)
    })
  })

  describe('clearCart', () => {
    it('clears all items from the cart', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.addItem({
        id: '2',
        productId: 'p2',
        title: 'VIP',
        price: 50,
        quantity: 1,
        imageUrl: '/vip.jpg',
      })

      store.clearCart()

      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
      expect(store.lastAddedItemId).toBeNull()
    })

    it('handles clearing an already empty cart', () => {
      const store = useCartStore()
      store.clearCart()
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.itemCount).toBe(0)
    })
  })

  describe('persistence', () => {
    it('persists items to localStorage after add', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      const stored = JSON.parse(localStorage.getItem('ticket-challenger-cart') || '[]')
      expect(stored).toHaveLength(1)
      expect(stored[0].productId).toBe('p1')
    })

    it('persists items to localStorage after remove', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.removeItem('p1')

      const stored = JSON.parse(localStorage.getItem('ticket-challenger-cart') || '[]')
      expect(stored).toEqual([])
    })

    it('persists items to localStorage after updateQuantity', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.updateQuantity('p1', 'General Admission', 5)

      const stored = JSON.parse(localStorage.getItem('ticket-challenger-cart') || '[]')
      expect(stored[0].quantity).toBe(5)
    })

    it('persists items to localStorage after clearCart', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })
      store.clearCart()

      const stored = localStorage.getItem('ticket-challenger-cart')
      expect(stored).toBe('[]')
    })
  })

  describe('immutability', () => {
    it('does not mutate items array directly on add', () => {
      const store = useCartStore()
      const initialItems = store.items

      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      expect(store.items).not.toBe(initialItems)
    })

    it('does not mutate items array directly on remove', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      const itemsBeforeRemove = store.items
      store.removeItem('p1')

      expect(store.items).not.toBe(itemsBeforeRemove)
    })

    it('does not mutate items array directly on updateQuantity', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      const itemsBeforeUpdate = store.items
      store.updateQuantity('p1', 'General Admission', 5)

      expect(store.items).not.toBe(itemsBeforeUpdate)
    })

    it('does not mutate items array directly on clearCart', () => {
      const store = useCartStore()
      store.addItem({
        id: '1',
        productId: 'p1',
        title: 'General Admission',
        price: 25,
        quantity: 2,
        imageUrl: '/ticket.jpg',
      })

      const itemsBeforeClear = store.items
      store.clearCart()

      expect(store.items).not.toBe(itemsBeforeClear)
    })
  })
})