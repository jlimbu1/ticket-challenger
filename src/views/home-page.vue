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
          placeholder="Enter Username"
          maxlength="12"
        />
      </div>
      <nav class="py-5">
        <div
          class="custom-btn mb-6"
          tabindex="0"
          @click="createTicketingSession"
        >
          <span>Start</span>
        </div>
        <div
          class="custom-btn mb-5"
          tabindex="0"
          @click="goTo('highscoresPage')"
        >
          <span>Highscore</span>
        </div>
        <div class="custom-btn" tabindex="0" @click="goTo('infoPage')">
          <span>Info</span>
        </div>
      </nav>
      <span class="author-text">By Kiritoislegit1</span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
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

function goTo(page, params = null) {
  if (params) router.push({ name: page, params });
  else router.push({ name: page });
}

function createTicketingSession() {
  apiStore
    .createTicketingSession({ username: username.value })
    .then(() => {
      console.log("Ticketing session created successfully");
      goTo("queuePage", { id: apiStore?.ticketingSession?._id });
    })
    .catch((error) => {
      console.error("Error creating ticketing session:", error);
    });
}

onMounted(() => {
  const stored = localStorage.getItem("username");
  if (stored && stored.trim()) {
    username.value = stored;
  } else {
    username.value = generateRandomName();
    saveUsername();
  }
});
</script>
