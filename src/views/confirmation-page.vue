<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(true)

onMounted(async () => {
  const orderId = route.params.orderId as string
  await orderStore.fetchOrderById(orderId)
  loading.value = false
})

const order = orderStore.currentOrder
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-2xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-red-400" />
      </div>

      <!-- Error -->
      <div v-else-if="!order" class="text-center py-20">
        <p class="text-red-400 text-xl mb-4" style="font-family: 'My Chemical Romance', serif">Order Not Found</p>
        <p class="text-gray-500 mb-6">The darkness has swallowed this order...</p>
        <button @click="router.push('/')" class="py-2 px-6 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60">Return Home</button>
      </div>

      <!-- Success -->
      <div v-else>
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">&#x2714;</div>
          <h1 class="text-3xl text-red-400 mb-2" style="font-family: 'My Chemical Romance', serif">Thank You!</h1>
          <p class="text-gray-400">Your order has been confirmed.</p>
        </div>

        <div class="p-6 bg-gray-900 rounded border border-red-900/30 space-y-4">
          <div>
            <span class="text-gray-500 text-sm">Order ID</span>
            <p class="text-gray-200 font-mono">{{ order.id }}</p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">Status</span>
            <p class="text-green-400 capitalize">{{ order.status }}</p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">Date</span>
            <p class="text-gray-200">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>

          <div class="border-t border-red-900/20 pt-4">
            <h3 class="text-red-400 mb-3" style="font-family: 'My Chemical Romance', serif">Items</h3>
            <div v-for="item in order.items" :key="item.productId" class="flex justify-between py-2 border-b border-gray-800">
              <div>
                <p class="text-gray-200">{{ item.title }}</p>
                <p class="text-gray-500 text-sm">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-red-400">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between font-bold text-lg pt-2 border-t border-red-900/20">
            <span>Total</span>
            <span class="text-red-400">${{ order.total.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="router.push('/')" class="flex-1 py-3 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">Home</button>
          <button @click="router.push('/orders')" class="flex-1 py-3 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60">View Orders</button>
        </div>
      </div>
    </div>
  </div>
</template>
