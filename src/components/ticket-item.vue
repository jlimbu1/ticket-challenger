<template>
  <div class="ticket-card" :class="{ isSoldOut: props.ticket.isSoldOut }">
    <div class="ticket-header">
      <h3>
        {{ props.ticket.name || "-" }}
        <div class="sold-out-label">SOLD OUT</div>
      </h3>
      <span class="price">${{ props.ticket.price || "-" }}</span>
    </div>
    <div class="quantity-btn-container">
      <button class="icon-btn" @click="$emit('decrement', props.ticket._id)">
        -
      </button>
      {{ props.ticket.quantity }}
      <button class="icon-btn" @click="$emit('increment', props.ticket._id)">
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ITicketCartInfo } from "@/interface";

const props = defineProps<{
  ticket: ITicketCartInfo;
}>();

defineEmits<{
  (e: "increment", id: string): void;
  (e: "decrement", id: string): void;
}>();
</script>

<style scoped></style>
