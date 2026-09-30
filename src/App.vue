<script setup></script>

<template>
    <nav
        class="fixed top-0 left-0 right-0 z-30 bg-gray-950/90 backdrop-blur border-b border-red-900/20"
    >
        <div class="max-w-6xl mx-auto flex items-center justify-center px-4 py-2">
            <router-link
                to="/"
                class="text-red-400 hover:text-red-300 text-lg sm:text-xl"
                style="font-family: 'My Chemical Romance', serif"
            >
                TICKET CHALLENGER
            </router-link>
        </div>
    </nav>

    <div class="pt-12">
        <router-view />
    </div>
</template>

<style scoped></style>
