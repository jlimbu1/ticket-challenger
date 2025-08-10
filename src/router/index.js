// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import homePage from "@/views/home-page.vue";
import queuePage from "@/views/queue-page.vue";
import ticketingPage from "@/views/ticketing-page.vue";
import summaryPage from "@/views/summary-page.vue";
import highscoresPage from "@/views/highscores-page.vue";
import infoPage from "@/views/info-page.vue";
import expiredSessionPage from "@/views/expired-session-page.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homePage",
      component: homePage,
    },
    {
      path: "/queue/:id",
      name: "queuePage",
      component: queuePage,
      props: true,
    },
    {
      path: "/ticketing/:id",
      name: "ticketingPage",
      component: ticketingPage,
      props: true,
    },
    {
      path: "/summary/:id",
      name: "summaryPage",
      component: summaryPage,
      props: true,
    },
    {
      path: "/highscore",
      name: "highscoresPage",
      component: highscoresPage,
    },
    {
      path: "/info",
      name: "infoPage",
      component: infoPage,
    },
    {
      path: "/expired/:id",
      name: "expiredSessionPage",
      component: expiredSessionPage,
      props: true,
    },
  ],
});

export default router;
