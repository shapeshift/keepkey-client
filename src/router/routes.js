

const routes = [
  {
    path: '/',
    redirect: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('pages/Settings.vue'),
        props: true
      },
      {
        path: '/main',
        name: 'Main',
        component: () => import('pages/Main.vue'),
        props: true
      },
      {
        path: '/keepkey',
        name: 'KeepKey',
        component: () => import('pages/KeepKey.vue'),
        props: true
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
