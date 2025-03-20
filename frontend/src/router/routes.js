const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'utilizatori', component: () => import('pages/Utilizatori.vue') },
      { path: 'structuri', component: () => import('pages/Structuri.vue') },
      { path: 'atributestructuri', component: () => import('pages/AtributeStructuri.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
