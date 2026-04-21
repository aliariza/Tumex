import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import api from '../lib/api'
import store from '../store'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import HakkindaView from '../views/hakkimizda/HakkindaView.vue'
import TumexCalismaView from '../views/kariyer/TumexCalismaView.vue'
import AcikPozisyonlarView from '../views/kariyer/AcikPozisyonlarView.vue'
import ServislerView from '../views/iletisim/ServislerView.vue'
import { canAccessRoute, getRouteAccess, isPublicRoute } from '@/services/authAccess'
import { hasSessionToken } from '@/services/authSession'

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
    meta: { access: 'protected' }
  },
  {
    path: '/protected/abkant',
    name: 'ProtectedAbkant',
    component: () => import('../views/protected/ProtectedAbkant.vue'),
    meta: { access: 'protected' }
  },
  {
    path: '/protected/laser',
    name: 'ProtectedLaser',
    component: () => import('../views/protected/ProtectedLaser.vue'),
    meta: { access: 'protected' }
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLoginView.vue'),
    meta: { access: 'public' }
  },
  {
    path: '/admin/machines',
    name: 'AdminMachines',
    component: () => import('../views/admin/AdminMachinesView.vue'),
    meta: { access: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/AdminUsersView.vue'),
    meta: { access: 'admin' }
  },
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export function createAppRouter(options = {}) {
  const {
    apiClient = api,
    appStore = store,
    history = createWebHistory(import.meta.env.BASE_URL)
  } = options

  const router = createRouter({
    history,
    routes
  })

  router.beforeEach(async (to) => {
    const access = getRouteAccess(to)
    const hasToken = hasSessionToken()

    if (to.name === 'AdminLogin' && hasToken) {
      try {
        const { data: user } = await apiClient.get('/me')
        if (canAccessRoute(user, 'admin')) {
          return { name: 'AdminMachines' }
        }
      } catch {
        // allow login page
      }
    }

    if (isPublicRoute(to)) {
      return true
    }

    if (!hasToken) {
      appStore.dispatch('logout')
      return { name: 'bayi' }
    }

    try {
      const { data: user } = await apiClient.get('/me')

      if (!canAccessRoute(user, access)) {
        appStore.dispatch('logout')
        return access === 'admin' ? { name: 'home' } : { name: 'bayi' }
      }

      return true
    } catch {
      appStore.dispatch('logout')
      return { name: 'bayi' }
    }
  })

  return router
}

export { createMemoryHistory }

const router = createAppRouter()

export default router
