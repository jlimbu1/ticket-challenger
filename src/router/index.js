import { createRouter, createWebHistory } from 'vue-router'
import ProductsPage from '@/views/ProductsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/products',
    name: 'productsPage',
    component: ProductsPage
  },
  {
    path: '/products/:id',
    name: 'productDetail',
    component: () => import('@/views/ProductDetailPage.vue')
  },
  {
    path: '/cart',
    name: 'cartPage',
    component: () => import('@/views/CartPage.vue')
  },
  {
    path: '/checkout',
    name: 'checkoutPage',
    component: () => import('@/views/CheckoutPage.vue')
  },
  {
    path: '/order-confirmation',
    name: 'orderConfirmation',
    component: () => import('@/views/OrderConfirmation.vue')
  },
  {
    path: '/admin',
    name: 'adminDashboard',
    component: () => import('@/views/AdminDashboard.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router