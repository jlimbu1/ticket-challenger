<script setup>
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";

const router = useRouter();
const cart = useCartStore();

const handleClickHomeBtn = () => {
  router.push({ name: "homePage" });
};
</script>

<template>
  <!-- Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-30 bg-gray-950/90 backdrop-blur border-b border-red-900/20">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-red-400 hover:text-red-300" style="font-family: 'My Chemical Romance', serif">
          TICKET CHALLENGER
        </router-link>
        <router-link to="/orders" class="text-gray-400 hover:text-gray-300 text-sm">Orders</router-link>
        <router-link to="/profile" class="text-gray-400 hover:text-gray-300 text-sm">Profile</router-link>
        <router-link to="/highscore" class="text-gray-400 hover:text-gray-300 text-sm">Highscores</router-link>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/checkout" class="text-gray-400 hover:text-red-400 text-sm relative">
          Cart
          <span v-if="cart.itemCount > 0" class="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ cart.itemCount }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>

  <!-- Page Content -->
  <div class="pt-12">
    <router-view />
  </div>
</template>

<style scoped></style>
