<template>
  <div class="container">
    <div v-if="loading">
      <spinner />
    </div>

    <template v-else>
      <div v-if="isCreated">
        <h1>Verify To Enter Queue</h1>
        <recaptcha @verified="enterQueue" />
      </div>

      <template v-else-if="isWaiting">
        <h1>Queue Position: {{ formattedQueuePosition }}</h1>
        <div class="content">
          <p>Estimated wait time: {{ formattedWaitTime }}</p>
          <p>Last updated on: {{ lastUpdated }}</p>
        </div>
        <div>
          <img class="w-[100px] mx-auto" src="/loading.gif" alt="loading gif" />
          <div class="progress-container">
            <div
              class="progress-bar"
              :key="queuePosition"
              :style="{ width: progressPercentage + '%' }"
            ></div>
            <div class="progress-text">
              <span>Progress: {{ progressPercentage }}%</span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";
import { TicketingSessionStatus } from "@/interface";
import { useSocket } from "@/composables/useSocket";
import spinner from "@/components/spinner.vue";
import recaptcha from "@/components/recaptcha.vue";

const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();
const { socket } = useSocket();

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

const queuePosition = computed(
  () => apiStore.ticketingSession?.queuePosition ?? -1
);
const formattedQueuePosition = computed(() =>
  queuePosition.value > 0 ? queuePosition.value.toLocaleString() : "0"
);
const lastUpdated = computed(() =>
  new Date(apiStore.ticketingSession.updatedAt).toLocaleTimeString()
);

const formattedWaitTime = computed(() => {
  const seconds = Math.max(1, Math.floor(queuePosition.value * 0.04));
  if (seconds <= 1) return "Almost ready!";
  if (seconds < 60) return `About ${seconds} second${seconds !== 1 ? "s" : ""}`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}${
      remainingSeconds > 0
        ? ` ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
        : ""
    }`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} hour${hours !== 1 ? "s" : ""}${
    remainingMinutes > 0
      ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
      : ""
  }${
    remainingSeconds > 0
      ? ` ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
      : ""
  }`;
});

const progressPercentage = computed(() => {
  const initialQueuePosition =
    apiStore.ticketingSession?.initialQueuePosition ?? 0;

  if (!isWaiting.value || initialQueuePosition <= 0 || queuePosition.value <= 0)
    return 0;
  const progress =
    ((initialQueuePosition - queuePosition.value) / initialQueuePosition) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
});

// Methods
const enterQueue = () => {
  try {
    loading.value = true;
    apiStore.startTicketingSessionQueue(route.params.id as string);
  } catch (err) {
    error.value = "Failed to enter queue";
    console.error("Queue entry error:", err);
  } finally {
    loading.value = false;
  }
};

const fetchSession = async () => {
  try {
    loading.value = true;
    await apiStore.fetchTicketingSession(route.params.id as string);

    if (isInProgress.value)
      router.push({ name: "ticketingPage", params: { id: route.params.id } });

    if (isCompleted.value)
      router.push({ name: "summaryPage", params: { id: route.params.id } });

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

const handleQueueUpdate = (data: {
  status: TicketingSessionStatus;
  position: number;
  estimatedWait: number;
}) => {
  if (apiStore.ticketingSession) {
    apiStore.ticketingSession.queuePosition = data.position;
    apiStore.ticketingSession.status = data.status;
    apiStore.ticketingSession.updatedAt = new Date();
  }
};

const handleQueueComplete = () => {
  if (apiStore.ticketingSession) {
    apiStore.ticketingSession.status = TicketingSessionStatus.IN_PROGRESS;
    apiStore.ticketingSession.queuePosition = 0;
  }
  router.push({ name: "ticketingPage", params: { id: route.params.id } });
};

// Lifecycle hooks
onMounted(async () => {
  await fetchSession();

  socket.emit("subscribeToSession", route.params.id);
  socket.on("subscriptionConfirmed", (data) => {
    console.log("Successfully subscribed to session:", data.sessionId);
  });

  // Set up socket listeners
  socket.on("queueUpdate", handleQueueUpdate);
  socket.on("queueComplete", handleQueueComplete);

  // Handle socket connection errors
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
    error.value = "Connection error - please refresh";
  });
});

onBeforeUnmount(() => {
  socket.off("queueUpdate");
  socket.off("queueComplete");
  socket.off("connect_error");
});
</script>
