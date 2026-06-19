<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const editing = ref(false)
const saving = ref(false)
const message = ref<string | null>(null)

const form = ref({ name: '', email: '' })
const pwForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const pwError = ref<string | null>(null)
const pwSuccess = ref(false)

onMounted(async () => {
  await userStore.fetchProfile()
  if (userStore.profile) {
    form.value = { name: userStore.profile.name, email: userStore.profile.email }
  }
})

async function saveProfile() {
  saving.value = true
  message.value = null
  try {
    await userStore.updateProfile({ name: form.value.name, email: form.value.email })
    message.value = 'Profile updated successfully'
    editing.value = false
  } catch (err: any) {
    message.value = err?.message ?? 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
    pwError.value = 'Passwords do not match'
    return
  }
  if (pwForm.value.newPassword.length < 8) {
    pwError.value = 'Password must be at least 8 characters'
    return
  }
  saving.value = true
  pwError.value = null
  pwSuccess.value = false
  try {
    await userStore.changePassword(pwForm.value.currentPassword, pwForm.value.newPassword)
    pwSuccess.value = true
    pwForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err: any) {
    pwError.value = err?.message ?? 'Failed to change password'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-md mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/')" class="text-gray-400 hover:text-red-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Profile</h1>
      </div>

      <div v-if="userStore.loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-red-400" />
      </div>

      <div v-else-if="userStore.profile" class="space-y-6">
        <!-- Profile Info -->
        <div class="p-6 bg-gray-900 rounded border border-red-900/30">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-red-400" style="font-family: 'My Chemical Romance', serif">Account Info</h2>
            <button v-if="!editing" @click="editing = true" class="text-sm text-gray-400 hover:text-red-400">Edit</button>
          </div>

          <template v-if="editing">
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-500 mb-1">Name</label>
                <input v-model="form.name" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm text-gray-500 mb-1">Email</label>
                <input v-model="form.email" type="email" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
              </div>
              <p v-if="message" :class="message.includes('success') ? 'text-green-400' : 'text-red-400'" class="text-sm">{{ message }}</p>
              <div class="flex gap-3">
                <button @click="editing = false" class="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600">Cancel</button>
                <button @click="saveProfile" :disabled="saving" class="flex-1 py-2 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 disabled:opacity-50">
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2">
              <p><span class="text-gray-500 text-sm">Name</span><br/><span class="text-gray-200">{{ userStore.profile.name }}</span></p>
              <p><span class="text-gray-500 text-sm">Email</span><br/><span class="text-gray-200">{{ userStore.profile.email }}</span></p>
              <p><span class="text-gray-500 text-sm">Orders</span><br/><span class="text-gray-200">{{ userStore.profile.orderCount }}</span></p>
            </div>
          </template>
        </div>

        <!-- Change Password -->
        <div class="p-6 bg-gray-900 rounded border border-red-900/30">
          <h2 class="text-red-400 mb-4" style="font-family: 'My Chemical Romance', serif">Change Password</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-500 mb-1">Current Password</label>
              <input v-model="pwForm.currentPassword" type="password" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">New Password</label>
              <input v-model="pwForm.newPassword" type="password" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">Confirm New Password</label>
              <input v-model="pwForm.confirmPassword" type="password" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            </div>
            <p v-if="pwError" class="text-red-400 text-sm">{{ pwError }}</p>
            <p v-if="pwSuccess" class="text-green-400 text-sm">Password changed successfully</p>
            <button @click="changePassword" :disabled="saving"
              class="w-full py-3 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 disabled:opacity-50">
              {{ saving ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
