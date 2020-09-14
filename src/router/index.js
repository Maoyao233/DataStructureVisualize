import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/josephus',
    name: 'Josephus',
    component: () => import('../views/Josephus.vue')
  },
  {
    path: '/sort',
    name: 'Sort',
    component: () => import('../views/Sort.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
