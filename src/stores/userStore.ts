import { defineStore } from 'pinia'
import { api } from '@/api'
import type { UserProfile, PasswordChange } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    currentProfile: (state) => state.profile
  },

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const response = await api.getProfile()
        this.profile = response ? { ...response } : null
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch profile'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data: Partial<Omit<UserProfile, 'id'>>) {
      this.loading = true
      this.error = null
      try {
        const response = await api.updateProfile(data)
        if (response) {
          this.profile = { ...this.profile, ...response } as UserProfile
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to update profile'
      } finally {
        this.loading = false
      }
    },

    async changePassword(oldPassword: string, newPassword: string) {
      this.loading = true
      this.error = null
      try {
        await api.changePassword({ oldPassword, newPassword } as PasswordChange)
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to change password'
      } finally {
        this.loading = false
      }
    }
  }
})