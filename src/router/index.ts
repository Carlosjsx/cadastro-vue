import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarteiraFinanceiraDigitalView from '../views/CarteiraFinanceiraDigitalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/carteira',
      name: 'carteira-financeira',
      component: CarteiraFinanceiraDigitalView
    }
  ],
})

export default router