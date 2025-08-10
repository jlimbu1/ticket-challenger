<template>
  <div class="container">
    <div v-if="loading">
      <spinner />
    </div>

    <template v-else-if="isInProgress">
      <h1>Ticket Selection</h1>
      <p class="last-updated">Last Updated: {{ lastUpdated }}</p>
      <div class="content">
        <div class="tickets-container">
          <ticket-item
            v-for="ticket in ticketsQuantity"
            :key="ticket._id + ticket.quantity"
            :ticket="ticket"
            @increment="handleTicketIncrement"
            @decrement="handleTicketDecrement"
          />
        </div>
      </div>
      <div
        class="custom-btn float-right mt-5"
        tabindex="0"
        @click="handleCheckout"
      >
        CHECKOUT
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";
import {
  ITicketCartInfo,
  ITicketUpdateData,
  TicketingSessionStatus,
} from "@/interface";
import { useSocket } from "@/composables/useSocket";
import spinner from "@/components/spinner.vue";
import TicketItem from "@/components/ticket-item.vue";

const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();
const { socket } = useSocket();

const loading = ref(false);
const error = ref<string | null>(null);
const ticketsQuantity = ref<ITicketCartInfo[]>([]);
const lastUpdated = ref(new Date().toLocaleTimeString());

const isCreated = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.CREATED
);
const isInProgress = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.IN_PROGRESS
);
const isWaiting = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.WAITING
);
const isCompleted = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.COMPLETED
);
const isCancelled = computed(
  () => apiStore.ticketingSession?.status === TicketingSessionStatus.CANCELLED
);

const fetchSession = async () => {
  try {
    loading.value = true;
    await apiStore.fetchTicketingSession(route.params.id as string);

    if (isWaiting.value || isCreated.value)
      router.push({ name: "queuePage", params: { id: route.params.id } });

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

const handleTicketSale = (data: {
  updates: ITicketUpdateData[];
  timestamp: string;
}) => {
  ticketsQuantity.value = ticketsQuantity.value?.map((x) => ({
    ...x,
    isSoldOut: data?.updates?.find((y) => y._id === x._id)?.remaining === 0,
    quantity:
      data?.updates?.find((y) => y._id === x._id)?.remaining === 0
        ? 0
        : x.quantity,
  }));
  lastUpdated.value = new Date(data.timestamp).toLocaleTimeString();
};

const handleTicketIncrement = (ticketId: string) => {
  const indexToUpdate = ticketsQuantity.value.findIndex(
    (x) => x._id === ticketId
  );
  ticketsQuantity.value[indexToUpdate].quantity++;
};

const handleTicketDecrement = (ticketId: string) => {
  const indexToUpdate = ticketsQuantity.value.findIndex(
    (x) => x._id === ticketId
  );
  ticketsQuantity.value[indexToUpdate].quantity--;
};

const handleCheckout = async () => {
  await apiStore.checkoutTicketingSession(
    route.params.id as string,
    ticketsQuantity.value
  );

  // reset quantity
  ticketsQuantity.value = ticketsQuantity.value?.map((x) => ({
    ...x,
    quantity: 0,
  }));

  await fetchSession();
};

// Lifecycle hooks
onMounted(async () => {
  await fetchSession();
  ticketsQuantity.value = (await apiStore.fetchTickets())?.map((x) => ({
    _id: x._id,
    name: x.name,
    price: x.price,
    isSoldOut: false,
    quantity: 0,
  }));

  socket.emit("subscribeToSession", route.params.id);
  socket.on("subscriptionConfirmed", (data) => {
    console.log("Successfully subscribed to session:", data.sessionId);
  });

  // Set up socket listeners
  socket.on("ticketUpdate", handleTicketSale);

  // Handle socket connection errors
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
    error.value = "Connection error - please refresh";
  });
});

onBeforeUnmount(() => {
  socket.off("ticketUpdate");
  socket.off("connect_error");
});
</script>

<style scoped></style>
