import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'
import { api } from '@/api'

vi.mock('@/api', () => ({
  api: {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    submitOrder: vi.fn()
  }
}))

const mockOrders = [
  {
    id: 'ord-1',
    items: [
      { productId: 'prod-1', title: 'Ticket A', price: 20, quantity: 2 }
    ],
    total: 40,
    status: 'confirmed' as const,
    createdAt: '2026-06-19T12:00:00Z'
  },
  {
    id: 'ord-2',
    items: [
      { productId: 'prod-2', title: 'Ticket B', price: 15, quantity: 1 }
    ],
    total: 15,
    status: 'pending' as const,
    createdAt: '2026-06-20T08:30:00Z'
  }
]

const mockOrderSingle = {
  id: 'ord-1',
  items: [
    { productId: 'prod-1', title: 'Ticket A', price: 20, quantity: 2 }
  ],
  total: 40,
  status: 'confirmed' as const,
  createdAt: '2026-06-19T12:00:00Z'
}

const mockOrderSubmission = {
  items: [{ productId: 'prod-1', quantity: 2 }],
  total: 40
}

describe('orderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('initializes with default state', () => {
      const store = useOrderStore()
      expect(store.orders).toEqual([])
      expect(store.currentOrder).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('allOrders returns orders array', () => {
      const store = useOrderStore()
      store.orders = [...mockOrders]
      expect(store.allOrders).toEqual(mockOrders)
    })

    it('allOrders returns empty when no orders', () => {
      const store = useOrderStore()
      expect(store.allOrders).toEqual([])
    })

    it('orderById returns matching order', () => {
      const store = useOrderStore()
      store.orders = [...mockOrders]
      const order = store.orderById('ord-1')
      expect(order).toEqual(mockOrderSingle)
    })

    it('orderById returns null when id not found', () => {
      const store = useOrderStore()
      store.orders = [...mockOrders]
      const order = store.orderById('nonexistent')
      expect(order).toBeNull()
    })

    it('orderById returns null when orders empty', () => {
      const store = useOrderStore()
      expect(store.orderById('any')).toBeNull()
    })
  })

  describe('actions', () => {
    describe('fetchOrders', () => {
      it('sets orders on success', async () => {
        vi.mocked(api.getOrders).mockResolvedValue(mockOrders)
        const store = useOrderStore()
        await store.fetchOrders()
        expect(store.orders).toEqual(mockOrders)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on failure', async () => {
        const error = new Error('Network error')
        vi.mocked(api.getOrders).mockRejectedValue(error)
        const store = useOrderStore()
        await store.fetchOrders()
        expect(store.orders).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Network error')
      })

      it('sets generic error on non-Error rejection', async () => {
        vi.mocked(api.getOrders).mockRejectedValue('string error')
        const store = useOrderStore()
        await store.fetchOrders()
        expect(store.error).toBe('Failed to fetch orders')
      })

      it('sets loading true during call', async () => {
        vi.mocked(api.getOrders).mockImplementation(() => {
          return new Promise(resolve => setTimeout(() => resolve(mockOrders), 100))
        })
        const store = useOrderStore()
        const promise = store.fetchOrders()
        expect(store.loading).toBe(true)
        await promise
        expect(store.loading).toBe(false)
      })
    })

    describe('fetchOrderById', () => {
      it('sets currentOrder on success', async () => {
        vi.mocked(api.getOrderById).mockResolvedValue(mockOrderSingle)
        const store = useOrderStore()
        await store.fetchOrderById('ord-1')
        expect(store.currentOrder).toEqual(mockOrderSingle)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets currentOrder to null when response is null', async () => {
        vi.mocked(api.getOrderById).mockResolvedValue(null)
        const store = useOrderStore()
        await store.fetchOrderById('nonexistent')
        expect(store.currentOrder).toBeNull()
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on failure', async () => {
        const error = new Error('Not found')
        vi.mocked(api.getOrderById).mockRejectedValue(error)
        const store = useOrderStore()
        await store.fetchOrderById('nonexistent')
        expect(store.currentOrder).toBeNull()
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Not found')
      })

      it('sets generic error on non-Error rejection', async () => {
        vi.mocked(api.getOrderById).mockRejectedValue('string error')
        const store = useOrderStore()
        await store.fetchOrderById('any')
        expect(store.error).toBe('Failed to fetch order')
      })

      it('sets loading true during call', async () => {
        vi.mocked(api.getOrderById).mockImplementation(() => {
          return new Promise(resolve => setTimeout(() => resolve(mockOrderSingle), 100))
        })
        const store = useOrderStore()
        const promise = store.fetchOrderById('ord-1')
        expect(store.loading).toBe(true)
        await promise
        expect(store.loading).toBe(false)
      })
    })

    describe('submitOrder', () => {
      it('creates order and adds to orders on success', async () => {
        const apiResponse = { id: 'ord-3', items: mockOrderSubmission.items, total: 40 }
        vi.mocked(api.submitOrder).mockResolvedValue(apiResponse)
        const store = useOrderStore()
        store.orders = [...mockOrders]
        await store.submitOrder(mockOrderSubmission)
        expect(store.orders).toHaveLength(3)
        const newOrder = store.orders.find(o => o.id === 'ord-3')
        expect(newOrder).toBeDefined()
        expect(newOrder!.status).toBe('pending')
        expect(newOrder!.createdAt).toBeDefined()
        expect(store.currentOrder).toBeNull()
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on failure', async () => {
        const error = new Error('Invalid order')
        vi.mocked(api.submitOrder).mockRejectedValue(error)
        const store = useOrderStore()
        await store.submitOrder(mockOrderSubmission)
        expect(store.orders).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Invalid order')
      })

      it('sets generic error on non-Error rejection', async () => {
        vi.mocked(api.submitOrder).mockRejectedValue('string error')
        const store = useOrderStore()
        await store.submitOrder(mockOrderSubmission)
        expect(store.error).toBe('Failed to submit order')
      })

      it('sets loading true during call', async () => {
        vi.mocked(api.submitOrder).mockImplementation(() => {
          return new Promise(resolve => setTimeout(() => resolve({ id: 'ord-3', items: [], total: 0 }), 100))
        })
        const store = useOrderStore()
        const promise = store.submitOrder(mockOrderSubmission)
        expect(store.loading).toBe(true)
        await promise
        expect(store.loading).toBe(false)
      })
    })
  })
})