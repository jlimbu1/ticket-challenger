<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { products as allProducts } from '@/data/products'
import ProductCard from '@/components/ProductCard.vue'
import VinylSpinner from '@/components/VinylSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
}

const router = useRouter()
const products = ref<Product[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

function navigateToProduct(productId: string): void {
  router.push({ name: 'productDetail', params: { id: productId } })
}

async function fetchProducts(): Promise<void> {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    if (!Array.isArray(allProducts)) {
      throw new Error('Invalid product data format')
    }

    products.value = allProducts as Product[]
  } catch (err) {
    hasError.value = true
    errorMessage.value =
      err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <ErrorBoundary>
    <div class="products-page min-h-screen bg-gray-900 text-white p-6">
      <h1 class="text-3xl font-bold mb-8 text-center md:text-left">
        Merchandise
      </h1>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <VinylSpinner />
      </div>

      <div v-else-if="hasError" class="text-center py-20">
        <p class="text-red-400 text-lg mb-4">{{ errorMessage }}</p>
        <button
          @click="fetchProducts"
          class="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded text-white transition-colors"
        >
          Retry
        </button>
      </div>

      <div v-else-if="products.length === 0" class="py-20">
        <EmptyState message="No products available at this time." />
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="product in products"
          :key="product.id"
          @click="navigateToProduct(product.id)"
          class="cursor-pointer"
        >
          <ProductCard
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :image="product.image"
            :description="product.description"
            :category="product.category"
            :stock="product.stock"
          />
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>