import { createRouter, createWebHashHistory } from 'vue-router'
import {constantsPCRouter} from '@/routers/routes'
export default createRouter({
  // 路由模式hash
  history: createWebHashHistory(),
  routes: constantsPCRouter(),
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})


