<template>
  <div class="container">
    <div v-if="loading">
      <spinner />
    </div>

    <template v-else-if="isCompleted">
      <h1>Checkout Result</h1>
      <div class="content">
        <div class="flex gap-3 mt-3 align-middle">
          <span class="p-2">Username: </span>
          <h2>{{ apiStore.ticketingSession?.username }}</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Price</th>
              <th>Bought</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in boughtTickets" :key="ticket.ticketId._id">
              <td>{{ ticket.ticketId.name }}</td>
              <td>{{ ticket.ticketId.price }}</td>
              <td>{{ ticket.bought }}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex gap-3 mt-3 align-middle">
          <span class="p-2">Total Score: </span>
          <h2>{{ apiStore.ticketingSession?._score }}</h2>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";
import { TicketingSessionStatus } from "@/interface";
import spinner from "@/components/spinner.vue";
import { getAllBoughtTickets } from "@/utils/helpers";

const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();

// Reactive state
const loading = ref(true);
const error = ref<string | null>(null);

// Computed properties
const isCreated = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.CREATED
);
const isWaiting = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.WAITING
);
const isInProgress = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.IN_PROGRESS
);
const isCompleted = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.COMPLETED
);
const isCancelled = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.CANCELLED
);
const boughtTickets = computed(() =>
  getAllBoughtTickets(apiStore.ticketingSession?.tickets)
);

// Methods
const fetchSession = async () => {
  try {
    loading.value = true;
    await apiStore.fetchTicketingSession(route.params.id as string);

    if (isWaiting.value || isCreated.value)
      router.push({ name: "queuePage", params: { id: route.params.id } });

    if (isInProgress.value)
      router.push({ name: "ticketingPage", params: { id: route.params.id } });

    if (isCancelled.value)
      router.push({
        name: "expiredSessionPage",
        params: { id: route.params.id },
      });
  } catch (err) {
    error.value = "Failed to load session";
    console.error("Session fetch error:", err);
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await fetchSession();
});
</script>
