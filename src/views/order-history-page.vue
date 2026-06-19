<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'

const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(true)
const expanded = ref<string | null>(null)

onMounted(async () => {
  await orderStore.fetchOrders()
  loading.value = false
})

function toggleExpand(id: string) {
  expanded.value = expanded.value === id ? null : id
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString()
}

const orders = orderStore.allOrders
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/')" class="text-gray-400 hover:text-red-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Order History</h1>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-red-400" />
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg italic" style="font-family: 'My Chemical Romance', serif">No orders yet... the silence is deafening.</p>
        <button @click="router.push('/')" class="mt-6 py-2 px-6 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60">Browse Events</button>
      </div>

      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id"
          class="bg-gray-900 rounded border border-red-900/20 overflow-hidden cursor-pointer"
          @click="toggleExpand(order.id)">
          <div class="p-4 flex justify-between items-center">
            <div>
              <p class="text-gray-200 font-mono text-sm">{{ order.id }}</p>
              <p class="text-gray-500 text-xs">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <span class="text-red-400 font-bold">${{ order.total.toFixed(2) }}</span>
              <p class="text-xs capitalize" :class="order.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'">
                {{ order.status }}
              </p>
            </div>
          </div>
          <div v-if="expanded === order.id" class="px-4 pb-4 border-t border-red-900/20 pt-3">
            <div v-for="item in order.items" :key="item.productId" class="flex justify-between py-2 text-sm">
              <span class="text-gray-300">{{ item.title }} x{{ item.quantity }}</span>
              <span class="text-gray-400">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <button
              @click.stop="router.push(`/orders/${order.id}`)"
              class="mt-3 text-sm text-red-400 hover:text-red-300"
            >View full details &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
