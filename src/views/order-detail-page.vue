<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(true)

onMounted(async () => {
  await orderStore.fetchOrderById(route.params.orderId as string)
  loading.value = false
})

const order = orderStore.currentOrder
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/orders')" class="text-gray-400 hover:text-red-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Order Details</h1>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-red-400" />
      </div>

      <div v-else-if="!order" class="text-center py-20">
        <p class="text-gray-500">Order not found.</p>
      </div>

      <div v-else class="p-6 bg-gray-900 rounded border border-red-900/30 space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-gray-500">Order ID</span><p class="text-gray-200 font-mono">{{ order.id }}</p></div>
          <div><span class="text-gray-500">Status</span><p class="capitalize" :class="order.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'">{{ order.status }}</p></div>
          <div><span class="text-gray-500">Date</span><p class="text-gray-200">{{ new Date(order.createdAt).toLocaleString() }}</p></div>
          <div><span class="text-gray-500">Total</span><p class="text-red-400 font-bold">${{ order.total.toFixed(2) }}</p></div>
        </div>

        <div class="border-t border-red-900/20 pt-4">
          <h3 class="text-red-400 mb-3" style="font-family: 'My Chemical Romance', serif">Items</h3>
          <div v-for="item in order.items" :key="item.productId" class="flex justify-between py-2 border-b border-gray-800">
            <div>
              <p class="text-gray-200">{{ item.title }}</p>
              <p class="text-gray-500 text-sm">${{ item.price.toFixed(2) }} x {{ item.quantity }}</p>
            </div>
            <span class="text-red-400">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
