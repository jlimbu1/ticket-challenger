// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import homePage from "@/views/home-page.vue";
import queuePage from "@/views/queue-page.vue";
import ticketingPage from "@/views/ticketing-page.vue";
import summaryPage from "@/views/summary-page.vue";
import highscoresPage from "@/views/highscores-page.vue";
import infoPage from "@/views/info-page.vue";
import expiredSessionPage from "@/views/expired-session-page.vue";
import checkoutPage from "@/views/checkout-page.vue";
import confirmationPage from "@/views/confirmation-page.vue";
import orderHistoryPage from "@/views/order-history-page.vue";
import orderDetailPage from "@/views/order-detail-page.vue";
import profilePage from "@/views/profile-page.vue";
import adminEventsPage from "@/views/admin-events-page.vue";
import adminEventFormPage from "@/views/admin-event-form-page.vue";

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
    {
      path: "/checkout",
      name: "checkoutPage",
      component: checkoutPage,
    },
    {
      path: "/confirmation/:orderId",
      name: "confirmationPage",
      component: confirmationPage,
      props: true,
    },
    {
      path: "/orders",
      name: "orderHistoryPage",
      component: orderHistoryPage,
    },
    {
      path: "/orders/:orderId",
      name: "orderDetailPage",
      component: orderDetailPage,
      props: true,
    },
    {
      path: "/profile",
      name: "profilePage",
      component: profilePage,
    },
    {
      path: "/admin/events",
      name: "adminEventsPage",
      component: adminEventsPage,
    },
    {
      path: "/admin/events/new",
      name: "adminEventCreate",
      component: adminEventFormPage,
    },
    {
      path: "/admin/events/:eventId/edit",
      name: "adminEventEdit",
      component: adminEventFormPage,
      props: true,
    },
  ],
});

export default router;
