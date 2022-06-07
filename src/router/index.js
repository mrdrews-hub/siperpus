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
    next({ path: '/dashboard' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/member/dashboard',
    name: 'member.dashboard',
    component: () => import('@/views/MemberPages/Dashboard.vue'),
    meta: {
      layout: 'member',
    },
  },
  {
    path: '/member/books',
    name: 'member.book',
    component: () => import('@/views/MemberPages/BooksPage.vue'),
    meta: {
      layout: 'member',
    },
  },
  {
    path: '/member/peminjaman',
    name: 'member.peminjaman',
    component: () => import('@/views/MemberPages/PeminjamanPage.vue'),
    meta: {
      layout: 'member',
    },
  },
  {
    path: '/member/history',
    name: 'member.history',
    component: () => import('@/views/MemberPages/HistoryPage.vue'),
    meta: {
      layout: 'member',
    },
  },
  {
    path: '/member/account-settings',
    name: 'member.account-settings',
    component: () => import('@/views/MemberPages/AccountSettings.vue'),
    meta: {
      layout: 'member',
    },
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
    path: '/books',
    name: 'books',
    component: () => import('@/views/Books/BooksPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/stocks',
    name: 'stocks',
    component: () => import('@/views/Stock/StockPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/rack',
    name: 'rack',
    component: () => import('@/views/Rack/RackPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Categories/CategoriesPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/views/Member/MemberPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/borowing',
    name: 'borowing',
    component: () => import('@/views/Borowing/BorowingPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/return',
    name: 'return',
    component: () => import('@/views/Return/ReturnPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/pelanggaran',
    name: 'pelanggaran',
    component: () => import('@/views/Pelanggaran/PenaltyPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('@/views/Report/ReportPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/report/member',
    name: 'report.member',
    component: () => import('@/views/Report/ReportMember.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank'
    },
  },
  {
    path: '/report/borrow',
    name: 'report.borrow',
    component: () => import('@/views/Report/ReportBorrow.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank'
    },
  },
  {
    path: '/report/book',
    name: 'report.book',
    component: () => import('@/views/Report/ReportBook.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank'
    },
  },
  // {
  //   path: '/report/member',
  //   name: 'report.member',
  //   component: () => import('@/views/Report/ReportMember.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     layout: 'blank'
  //   },
  // },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: isLogin,
    component: () => import('@/views/Login.vue'),
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

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!token) {
//       console.log('NOT OK')
//       next({ name: 'Login' })
//     } else {
//       const isValid = verifyToken(token)
//       if (isValid === false) {
//         localStorage.removeItem('token')
//         next({ name: 'Login' })
//       } else {
//         next()
//       }
//     }
//   } else {
//     next()
//   }
  // const token = localStorage.getItem('token')
  // if (!token) {
  //   const decoded = jwt_decode(token)
  //   console.log(decoded);
  //   next()
  // } else {
  //   next()
  // }
// })

export default router
