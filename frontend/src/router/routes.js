const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'utilizatori', component: () => import('pages/Utilizatori.vue') },
      { path: 'structuri', component: () => import('pages/Structuri.vue') },
      { path: 'atributestructuri', component: () => import('pages/AtributeStructuri.vue') },
      {
        path: 'articles',
        name: 'ArticleList',
        component: () => import('pages/ArticleListPage.vue'),
      },
      {
        path: 'articles/new',
        name: 'ArticleCreate',
        component: () => import('pages/ArticleEditPage.vue'),
      },
      {
        path: 'articles/:id',
        name: 'ArticleView',
        component: () => import('pages/ArticleViewPage.vue'),
        props: true, // Pass route params as props
      },
      {
        path: 'articles/:id/edit',
        name: 'ArticleEdit',
        component: () => import('pages/ArticleEditPage.vue'),
        props: true, // Pass route params as props
      },
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
