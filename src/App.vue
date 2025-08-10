<script setup>
import { useRouter } from "vue-router";
import homeIcon from "@/assets/svgs/home-icon.svg";

const router = useRouter();

const handleClickHomeBtn = () => {
  router.push({ name: "homePage" });
};
</script>

<template>
  <router-view />
  <homeIcon tabindex="0" class="home-btn" @click="handleClickHomeBtn" />
</template>

<style scoped></style>
