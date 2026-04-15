import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import HakkindaView from '../views/hakkimizda/HakkindaView.vue'
import TumexCalismaView from '../views/kariyer/TumexCalismaView.vue'
import AcikPozisyonlarView from '../views/kariyer/AcikPozisyonlarView.vue'
import ServislerView from '../views/iletisim/ServislerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/solutions',
    name: 'solutions',
    component: HomeView
  },
  {
    path: '/laser-cutting',
    name: 'laserCutting',
    component: () => import('../views/MachineView.vue'),
    props: { machineType: 'laser-cutting' }
  },
  {
    path: '/abkant',
    name: 'abkant',
    component: () => import('../views/MachineView.vue'),
    props: { machineType: 'abkant' }
  },
  {
    path: '/:machineType/:productType',
    name: 'productType',
    component: () => import('../views/ProductView.vue'),
    props: true,
    beforeEnter: (to, _from, next) => {
      const validMachineTypes = ['laser-cutting', 'abkant']
      if (!validMachineTypes.includes(to.params.machineType)) {
        next({ name: 'NotFound' })
      } else {
        next()
      }
    }
  },
  {
    path: '/company',
    name: 'company',
    redirect: { name: 'hakkinda' }
  },
  {
    path: '/hakkinda',
    name: 'hakkinda',
    component: HakkindaView
  },
  {
    path: '/durmark-tarihce',
    name: 'tarihce',
    component: () => import('../views/durmark/DurmarkView.vue'),
    props: true
  },
  {
    path: '/iletisim',
    name: 'iletisim',
    redirect: { name: 'merkezOfis' }
  },
  {
    path: '/iletisim/merkez-ofis',
    name: 'merkezOfis',
    component: () => import('../views/iletisim/MerkezOfisView.vue')
  },
  {
    path: '/iletisim/bayi',
    name: 'bayi',
    component: () => import('../views/iletisim/BayiView.vue')
  },
  {
    path: '/iletisim/servisler',
    name: 'servisler',
    component: ServislerView
  },
  {
    path: '/kariyer',
    name: 'kariyer',
    redirect: { name: 'tumexCalisma' }
  },
  {
    path: '/kariyer/tumex-calisma',
    name: 'tumexCalisma',
    component: TumexCalismaView
  },
  {
    path: '/kariyer/acik-pozisyonlar',
    name: 'acikPozisyonlar',
    component: AcikPozisyonlarView
  },
  {
    path: '/protected',
    name: 'Protected',
    component: () => import('../views/protected/Protected.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/protected/abkant',
    name: 'ProtectedAbkant',
    component: () => import('../views/protected/ProtectedAbkant.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/protected/laser',
    name: 'ProtectedLaser',
    component: () => import('../views/protected/ProtectedLaser.vue'),
    meta: { requiresAuth: true }
  },
  // Catch-all route for 404 not found
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && !sessionStorage.getItem('token')) {
    next({ name: 'bayi' })
  } else {
    next()
  }
})

export default router
