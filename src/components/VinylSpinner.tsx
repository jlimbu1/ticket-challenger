<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  color?: 'crimson' | 'purple' | 'white'
  speed?: 'slow' | 'normal' | 'fast'
}>()

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
}

const colorMap = {
  crimson: 'border-crimson-500 border-t-crimson-300',
  purple: 'border-purple-500 border-t-purple-300',
  white: 'border-gray-600 border-t-gray-300',
}

const speedMap = {
  slow: 'animate-spin-slow',
  normal: 'animate-spin',
  fast: 'animate-spin-fast',
}

const containerClass = ref('')
const spinnerClass = ref('')

onMounted(() => {
  const size = props.size || 'md'
  const color = props.color || 'crimson'
  const speed = props.speed || 'normal'

  containerClass.value = [
    'inline-flex items-center justify-center',
    sizeMap[size],
  ].join(' ')

  spinnerClass.value = [
    'w-full h-full rounded-full border-2 border-solid',
    colorMap[color],
    speedMap[speed],
  ].join(' ')
})

onUnmounted(() => {
  containerClass.value = ''
  spinnerClass.value = ''
})
</script>

<template>
  <div :class="containerClass" role="status" aria-label="Loading">
    <div :class="spinnerClass" />
  </div>
</template>