import { RouteRecordRaw } from 'vue-router';
import layout from '@/layout/index.vue';

const adminRoutes: RouteRecordRaw = {
  path: '/',
  name: 'Index',
  component: layout,
  redirect: '/user',
  meta: {
    title: '主页'
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/userAdmin/index.vue'),
      meta: {
        title: '房产管理',
        // icon: 'renyuanguanli'
      }
    },
    {
      path: 'table',
      name: 'Table',
      component: () => import('@/views/table/index.vue'),
      meta: {
        title: '联络记录',
        // icon: 'search_icon'
      }
    }
  ]
};

export default adminRoutes;
