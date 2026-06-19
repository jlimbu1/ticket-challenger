<script setup lang="ts">
import { ref, onErrorCaptured, type Ref } from 'vue'

interface ErrorBoundaryProps {
  fallback?: string
  onError?: (error: Error, errorInfo: string) => void
}

const props = withDefaults(defineProps<ErrorBoundaryProps>(), {
  fallback: '',
  onError: undefined,
})

const hasError: Ref<boolean> = ref(false)
const error: Ref<Error | null> = ref(null)
const errorInfo: Ref<string> = ref('')

onErrorCaptured((err: Error, instance: any, info: string) => {
  hasError.value = true
  error.value = err
  errorInfo.value = info

  if (props.onError) {
    props.onError(err, info)
  }

  console.error('ErrorBoundary caught an error:', err, info)

  return false
})

const handleReset = (): void => {
  hasError.value = false
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <div v-if="hasError" data-testid="error-boundary">
    <div v-if="props.fallback" v-html="props.fallback" />
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="max-w-md w-full mx-auto p-8 text-center">
        <div class="mb-6">
          <svg
            class="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.5 0-1.833-1.54-3.5-3.5-3.5h-1.5c-1.833 0-3.5-1.667-3.5-3.5S10.667 5 12.5 5H14"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p class="text-gray-400 mb-6">
          {{ error?.message || 'An unexpected error occurred. Please try again.' }}
        </p>
        <button
          class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          @click="handleReset"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>