<template>
  <div class="recaptcha-container" :class="{ 'recaptcha-checked': isChecked }">
    <div class="flex align-center">
      <div class="recaptcha-checkbox" @click="handleClick">
        <div
          class="recaptcha-checkbox-border"
          v-show="!isChecking && !isChecked"
        ></div>
        <div
          class="recaptcha-checkbox-checkmark"
          v-show="isChecked && !isChecking"
        >
          <svg class="checkmark-svg" viewBox="0 0 18 18" fill="none">
            <path
              d="M5 9L8 12L13 7"
              stroke="#0f9d58"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="recaptcha-spinner" v-show="isChecking">
          <div class="recaptcha-spinner-icon"></div>
        </div>
      </div>
      <div class="recaptcha-label">"I'm not a robot"</div>
    </div>
    <img src="/RecaptchaLogo.png" alt="recaptchaLogo" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["verified"]);

const isChecked = ref(false);
const isChecking = ref(false);

const handleClick = () => {
  if (isChecked.value || isChecking.value) return;

  isChecking.value = true;

  setTimeout(() => {
    isChecking.value = false;
    isChecked.value = true;
    emit("verified");
  }, 5000);
};
</script>

<style scoped>
.recaptcha-container {
  display: inline-flex;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  user-select: none;
  cursor: pointer;
  width: 300px;
  height: 74px;
  justify-content: space-between;
  img {
    width: 58px;
  }
}

.recaptcha-checkbox {
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Initial state border */
.recaptcha-checkbox-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #c1c1c1;
  border-radius: 2px;
  background-color: white;
}

/* Checkmark container - positioned outside the checkbox */
.recaptcha-checkbox-checkmark {
  position: absolute;
  left: -7px; /* Adjust to position properly */
  top: -3px; /* Adjust to position properly */
  width: 38px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Larger checkmark SVG */
.checkmark-svg {
  width: 38px;
  height: 30px;
}

.recaptcha-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.recaptcha-spinner-icon {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(66, 133, 244, 0.2);
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.recaptcha-label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}
</style>
