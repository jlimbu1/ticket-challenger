import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { Order, OrderSubmission } from '@/types'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const allOrders = computed(() => orders.value)
  const orderById = computed(() => (id: string) =>
    orders.value.find(o => o.id === id) ?? null
  )

  async function fetchOrders(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await api.getOrders()
      orders.value = Array.isArray(data) ? [...data] : []
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await api.getOrderById(id)
      currentOrder.value = data ? { ...data } : null
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch order'
    } finally {
      loading.value = false
    }
  }

  async function submitOrder(orderData: OrderSubmission): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await api.submitOrder(orderData)
      const newOrder: Order = {
        id: data.id,
        items: data.items ?? [],
        total: data.total,
        status: data.status ?? 'pending',
        createdAt: data.createdAt ?? new Date().toISOString(),
      }
      orders.value = [...orders.value, newOrder]
      currentOrder.value = { ...newOrder }
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to submit order'
    } finally {
      loading.value = false
    }
  }

  return {
    orders, currentOrder, loading, error,
    allOrders, orderById,
    fetchOrders, fetchOrderById, submitOrder,
  }
})
