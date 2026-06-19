<template>
  <div class="container">
    <div v-if="loading">
      <spinner />
    </div>
    <template v-else>
      <h1>Highscores</h1>
      <div class="content">
        <table class="clickable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="session in ticketingSessionList"
              :key="session._id"
              tabindex="0"
              @click="handleShowSession(session._id)"
            >
              <td>{{ session.username }}</td>
              <td>{{ session._score }}</td>
              <td>{{ formattedDate(new Date(session.updatedAt)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";
import spinner from "@/components/spinner.vue";
import { TicketingSessionStatus } from "@/interface";

const apiStore = useApiStore();
const router = useRouter();

// Reactive state
const loading = ref(true);
const error = ref<string | null>(null);

const ticketingSessionList = computed(() => apiStore.ticketingSessionList);

const handleShowSession = (id: string) => {
  router.push({ name: "summaryPage", params: { id } });
};

function formattedDate(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Check if the date is today
  const isToday = now.toDateString() === date.toDateString();

  if (diffInSeconds < 60) {
    return diffInSeconds === 0 ? "Just now" : `${diffInSeconds} sec ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (isToday) {
    return `${diffInHours} hour ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

const fetchSession = async () => {
  try {
    loading.value = true;
    await apiStore.fetchTicketingSessionList({
      status: TicketingSessionStatus.COMPLETED,
      sortBy: "_score",
    });
  } catch (err) {
    error.value = "Failed to load session";
    console.error("Session fetch error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchSession();
});
</script>
