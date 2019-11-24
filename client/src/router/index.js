import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Records from '@/components/Records'
import KNN from '@/components/KNN'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/records',
      name: 'Records',
      component: Records
    },
    {
      path: '/knn',
      name: 'KNN',
      component: KNN
    }
  ]
})
