<script setup lang="ts">
import { computed } from 'vue'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  action?: string
  className?: string
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  title: 'The shelves are bare',
  message: '',
  icon: '',
  action: '',
  className: '',
})

const DEFAULT_POETIC_MESSAGES: string[] = [
  'The shelf stands empty, waiting for your collection.',
  'Silence echoes in these hollow halls.',
  'No records spin in this forgotten corner.',
  'The jukebox weeps for songs not yet chosen.',
  'A blank page in the book of melodies.',
  'The stage is dark, the crowd has gone.',
  'These halls remember songs that never played.',
  'A ghost of music lingers in the air.',
  'The needle waits for a groove to find.',
  'Every masterpiece begins with an empty canvas.',
]

const getRandomPoeticMessage = (): string => {
  return DEFAULT_POETIC_MESSAGES[Math.floor(Math.random() * DEFAULT_POETIC_MESSAGES.length)]
}

const displayMessage = computed<string>(() => {
  return props.message || getRandomPoeticMessage()
})

const hasIcon = computed<boolean>(() => {
  return props.icon !== ''
})

const hasAction = computed<boolean>(() => {
  return props.action !== ''
})
</script>

<template>
  <div
    data-testid="empty-state"
    :class="[
      'flex flex-col items-center justify-center text-center px-6 py-16',
      props.className,
    ]"
    role="status"
    aria-label="Empty state"
  >
    <div v-if="hasIcon" class="mb-4">
      <span class="text-4xl" data-testid="empty-state-icon">{{ props.icon }}</span>
    </div>
    <h2 class="text-2xl font-bold text-crimson-100 mb-2" data-testid="empty-state-title">
      {{ props.title }}
    </h2>
    <p class="text-crimson-300 max-w-md mb-6" data-testid="empty-state-message">
      {{ displayMessage }}
    </p>
    <div v-if="hasAction" class="mt-2">
      <slot name="action">
        <button
          class="px-6 py-2 bg-crimson-700 hover:bg-crimson-600 text-white rounded-lg transition-colors duration-200"
          data-testid="empty-state-action"
        >
          {{ props.action }}
        </button>
      </slot>
    </div>
    <div v-else>
      <slot name="action" />
    </div>
  </div>
</template>