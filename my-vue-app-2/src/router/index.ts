import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Index from '../pages/Index.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/index', name: 'Index', component: Index }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
