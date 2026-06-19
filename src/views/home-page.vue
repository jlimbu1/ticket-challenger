<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";

const apiStore = useApiStore();
const router = useRouter();

const username = ref("");

function generateRandomName() {
  return "User" + Math.floor(Math.random() * 10000);
}

function saveUsername() {
  localStorage.setItem("username", username.value);
}

function goTo(page: string, params: Record<string, string> | null = null) {
  if (params) {
    router.push({ name: page, params });
  } else {
    router.push({ name: page });
  }
}

async function createTicketingSession() {
  if (!username.value) {
    username.value = generateRandomName();
    saveUsername();
  }

  try {
    const session = await apiStore.createTicketingSession(username.value);
    if (session && session._id) {
      router.push({
        name: "ticketingPage",
        params: { sessionId: session._id },
      });
    }
  } catch (error) {
    console.error("Failed to create ticketing session:", error);
  }
}

onMounted(() => {
  const savedUsername = localStorage.getItem("username");
  if (savedUsername) {
    username.value = savedUsername;
  }
});
</script>

<template>
  <main class="container">
    <h1>TICKET CHALLENGER</h1>
    <div class="content">
      <div class="custom-input" :class="{ 'has-text': username }">
        <label for="username">Username:</label>
        <input
          id="username"
          v-model="username"
          @input="saveUsername"
          type="text"
          placeholder="Enter your username"
        />
      </div>
      <div
        class="custom-btn"
        tabindex="0"
        @click="createTicketingSession"
      >
        START
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0e0e0;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 0.5rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ff6b6b, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
}

.custom-input {
  width: 100%;
  position: relative;
}

.custom-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.custom-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.custom-input input:focus {
  border-color: #c084fc;
  box-shadow: 0 0 0 2px rgba(192, 132, 252, 0.2);
}

.custom-input.has-text input {
  border-color: #ff6b6b;
}

.custom-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff6b6b, #c084fc);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(192, 132, 252, 0.4);
}

.custom-btn:active {
  transform: translateY(0);
}
</style>