<script setup lang="ts">
import { computed } from 'vue'

interface GothicButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<GothicButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  className: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantStyles: Record<string, string> = {
  primary: 'bg-gradient-to-r from-crimson to-deepPurple text-white hover:brightness-110',
  secondary: 'bg-transparent border-2 border-crimson text-crimson hover:bg-crimson hover:text-white',
  danger: 'bg-gradient-to-r from-red-800 to-crimson text-white hover:brightness-110',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

const computedClasses = computed(() => {
  const variantClass = variantStyles[props.variant] || variantStyles.primary
  const sizeClass = sizeStyles[props.size] || sizeStyles.md
  return [
    'font-gothic tracking-wider uppercase',
    'rounded-md transition-all duration-300 ease-out',
    'active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    variantClass,
    sizeClass,
    props.className,
  ].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="computedClasses"
    :disabled="props.disabled"
    @click="handleClick"
    data-testid="gothic-button"
  >
    <slot />
  </button>
</template>