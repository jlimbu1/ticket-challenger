<template>
  <div class="container">
    <h1>Session</h1>
    <h1>{{ route.params.id }}</h1>
    <h1>is Expired!!!</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>
