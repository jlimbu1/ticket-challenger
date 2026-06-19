<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/apiStore";
import { useCartStore } from "@/stores/cartStore";
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
const cartStore = useCartStore();
const { socket } = useSocket();

const loading = ref(false);
const error = ref<string | null>(null);
const ticketsQuantity = ref<ITicketCartInfo[]>([]);
const lastUpdated = ref("");
const sessionStatus = ref<TicketingSessionStatus>(TicketingSessionStatus.CREATED);

const isInProgress = computed(() => {
  return sessionStatus.value === TicketingSessionStatus.IN_PROGRESS;
});

function handleTicketIncrement(ticket: ITicketCartInfo): void {
  const existingItem = cartStore.items.find(
    (item) => item.productId === ticket._id
  );
  if (existingItem) {
    cartStore.updateQuantity(ticket._id, "general", existingItem.quantity + 1);
  } else {
    cartStore.addItem({
      id: ticket._id,
      productId: ticket._id,
      title: ticket.name,
      price: ticket.price,
      quantity: 1,
      imageUrl: "",
    });
  }
}

function handleTicketDecrement(ticket: ITicketCartInfo): void {
  const existingItem = cartStore.items.find(
    (item) => item.productId === ticket._id
  );
  if (existingItem) {
    if (existingItem.quantity <= 1) {
      cartStore.removeItem(ticket._id, "general");
    } else {
      cartStore.updateQuantity(ticket._id, "general", existingItem.quantity - 1);
    }
  }
}

function handleCheckout(): void {
  router.push({ name: "checkoutPage" });
}

async function fetchSessionData(sessionId: string): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const session = await apiStore.getTicketingSession(sessionId);
    if (session) {
      sessionStatus.value = session.status;
      ticketsQuantity.value = session.tickets.map((t: ITicketUpdateData) => ({
        _id: t._id,
        name: t.name,
        price: t.price,
        isSoldOut: t.remaining <= 0,
        quantity: 0,
      }));
      lastUpdated.value = new Date(session.updatedAt).toLocaleTimeString();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load session";
    error.value = message;
    console.error("Failed to fetch ticketing session:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const sessionId = route.params.sessionId as string;
  if (sessionId) {
    fetchSessionData(sessionId);
  }
});

onBeforeUnmount(() => {
  socket?.off("ticketUpdate");
});
</script>

<template>
  <div class="container">
    <div v-if="loading">
      <spinner />
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button class="custom-btn mt-3" @click="router.push({ name: 'homePage' })">
        Back to Home
      </button>
    </div>

    <template v-else-if="isInProgress">
      <h1>Ticket Selection</h1>
      <p class="last-updated">Last Updated: {{ lastUpdated }}</p>
      <div class="content">
        <div class="tickets-container">
          <TicketItem
            v-for="ticket in ticketsQuantity"
            :key="ticket._id"
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

    <div v-else class="waiting-message">
      <p>Waiting for session to start...</p>
      <spinner />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.last-updated {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.tickets-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
}

.waiting-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.float-right {
  float: right;
}

.mt-5 {
  margin-top: 1.25rem;
}

.mt-3 {
  margin-top: 0.75rem;
}
</style>