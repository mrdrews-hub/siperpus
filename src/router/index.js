import Vue from 'vue'
import VueRouter from 'vue-router'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'

Vue.use(VueRouter)

/*
  PR!!
  CARA SUPAYA SEBELUM MASUK ROUTE SI TOKENNYA DI CHECK VALID ATAU TIDAKNYA
  KARENA KALAU HANYA DI CHECK ADA ATAU TIDAKNYA MUDAH UNTUK DIRETAS
*/
const verifyToken = token => {
  try {
    const decode = jwtDecode(token)

    return true
  } catch (err) {
    return false
  }
}

const isLogin = (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    alert('Anda Sudah Login! Tekan tombol logout untuk keluar')
    next({ path: '/dashboard' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    redirect: '/pages/login',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // beforeEnter: isAuthenticated,
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/user/TableUsers.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/cards/Card.vue'),
  },
  {
    path: '/simple-table',
    name: 'simple-table',
    component: () => import('@/views/simple-table/SimpleTable.vue'),
  },
  {
    path: '/form-layouts',
    name: 'form-layouts',
    component: () => import('@/views/form-layouts/FormLayouts.vue'),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
  },
  {
    path: '/pages/login',
    name: 'Login',
    beforeEnter: isLogin,
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/register',
    name: 'Register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      console.log('NOT OK')
      next({ name: 'Login' })
    } else {
      const isValid = verifyToken(token)
      if (isValid === false) {
        localStorage.removeItem('token')
        next({ name: 'Login' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
  // const token = localStorage.getItem('token')
  // if (!token) {
  //   const decoded = jwt_decode(token)
  //   console.log(decoded);
  //   next()
  // } else {
  //   next()
  // }
})

export default router
