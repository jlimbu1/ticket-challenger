import { defineStore } from 'pinia'
import { api } from '@/api'
import type { Order, OrderSubmission } from '@/types'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    allOrders: (state) => state.orders,
    orderById: (state) => {
      return (id: string) => state.orders.find((o) => o.id === id) ?? null
    }
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await api.getOrders()
        this.orders = [...response]
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.getOrderById(id)
        this.currentOrder = response ? { ...response } : null
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch order'
      } finally {
        this.loading = false
      }
    },

    async submitOrder(orderData: OrderSubmission) {
      this.loading = true
      this.error = null
      try {
        const response = await api.submitOrder(orderData)
        const newOrder: Order = {
          id: response.id,
          items: response.items ?? [],
          total: response.total,
          status: response.status ?? 'pending',
          createdAt: response.createdAt ?? new Date().toISOString()
        }
        this.orders = [...this.orders, newOrder]
        this.currentOrder = { ...newOrder }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to submit order'
      } finally {
        this.loading = false
      }
    }
  }
})