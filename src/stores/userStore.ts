import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { UserProfile } from '@/types'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentProfile = computed(() => profile.value)

  async function fetchProfile(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await api.getUserProfile()
      profile.value = data ? { ...data } : null
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch profile'
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: Partial<Pick<UserProfile, 'name' | 'email'>>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateUserProfile(data)
      if (updated && profile.value) {
        profile.value = { ...profile.value, ...updated }
      }
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to update profile'
    } finally {
      loading.value = false
    }
  }

  async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.changePassword(oldPassword, newPassword)
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to change password'
    } finally {
      loading.value = false
    }
  }

  return {
    profile, loading, error,
    currentProfile,
    fetchProfile, updateProfile, changePassword,
  }
})
