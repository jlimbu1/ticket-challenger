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
              <td>{{ new Date(session.updatedAt).toLocaleDateString() }}</td>
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
