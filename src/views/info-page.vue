<template>
  <div>
    <h1>Info</h1>

    <h1>Tickets ({{ totalCapacity }} total capacity)</h1>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ticket, index) in tickets" :key="`ticket-${index}`">
            <td>{{ ticket.name }}</td>
            <td>${{ ticket.price }}</td>
            <td>{{ ticket.capacity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useApiStore } from "@/stores/apiStore";

const apiStore = useApiStore();

const tickets = computed(() => apiStore.tickets);

const totalCapacity = computed(() =>
  tickets.value.reduce((sum, ticket) => sum + ticket.capacity, 0)
);

onMounted(() => {
  apiStore.fetchTickets();
});
</script>
