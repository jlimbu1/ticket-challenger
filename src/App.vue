<script setup lang="ts">
import { useRouter } from "vue-router";
import homeIcon from "@/assets/svgs/home-icon.svg";
import { useCartStore } from "@/stores/cartStore";

const router = useRouter();
const cartStore = useCartStore();

const handleClickHomeBtn = () => {
  router.push({ name: "homePage" });
};
</script>

<template>
  <router-view />
  <homeIcon tabindex="0" class="home-btn" @click="handleClickHomeBtn" />
</template>

<style scoped></style>