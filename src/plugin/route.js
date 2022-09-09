import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Setting from '@/views/MeInfo/setting.vue'
// import About from '@/views/About.vue'
// import Me from '@/views/Me.vue'
import MsgDetail from "@/views/MsgDetail"

import fygl from '@/views/app/fygl'
import fygl_add from '@/views/app/fygl_add'
import swgl from '@/views/app/swgl'
import swgl_add from '@/views/app/swgl_add'
import ycsb from '@/views/app/ycsb'
import iotctl from '@/views/app/iotctl'
import iotctl_setting from '@/views/app/iotctl_setting'
import qsxdrw from '@/views/app/qsxdrw'
import qsxdrw_add from '@/views/app/qsxdrw_add'
import ypxx from '@/views/app/ypxx'
import slxx from '@/views/app/slxx'
import ygxx from '@/views/app/ygxx'
import yzxx from '@/views/app/yzxx'
import tcap from '@/views/app/tcap'
import tcap_add from '@/views/app/tcap_add'
import pzrw from '@/views/app/pzrw'
import pzjh from '@/views/app/pzjh'
import test from '@/views/app/test';
import userGroup from '@/views/app/userGroup'
import userGroupAdd from '@/views/app/user_group_add'

// const Home = { template: '<div>Home</div>' }
// const About = { template: '<div>About</div>' }

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { level:1, }},
  // { path: '/about', name: 'About', component: About, meta: { level:3, } },
  // { path: '/me', name: 'Me', component: Me, meta: { level:3,  /*keepAlive: false*/ } },

  // 个人信息-设定
  { path: '/msgdetail', name: "MsgDetail", component: MsgDetail, meta: { level:4, keepAlive: false} },

  // 个人信息-设定
  { path: '/meinfo/setting', name: "meinfo_setting", component: Setting, meta: { level:2, keepAlive: false} },

  // 防疫管理
  { path: '/app/fygl', name: 'fygl', component: fygl, meta: { level:2, } },
  { path: '/app/fygl/add', name: 'fygl_add', component: fygl_add, meta: { level:3, keepAlive: false} },
  
  // 饲喂管理
  { path: '/app/swgl', name: 'swgl', component: swgl, meta: { level:2, } },
  { path: '/app/swgl/add', name: 'swgl_add', component: swgl_add, meta: { level:3, keepAlive: false } },

  // 异常上报
  { path: '/app/ycsb', name: 'ycsb', component: ycsb, meta: { level:2, } },

  
  // 物联网设备
  { path: '/app/iotctl', name: 'iotctl', component: iotctl, meta: { level:2, } },
  { path: '/app/iotctl/setting', name: 'iotctl_setting', component: iotctl_setting, meta: { level:3, keepAlive: false } },

  // 清扫消毒任务
  { path: '/app/qsxdrw', name: 'qsxdrw', component: qsxdrw, meta: { level:2, } },
  { path: '/app/qsxdrw/add', name: 'qsxdrw_add', component: qsxdrw_add, meta: { level:3, keepAlive: false } },

  // 药品信息
  { path: '/app/ypxx', name: 'ypxx', component: ypxx, meta: { level:2, } },
  
  // 饲料信息
  { path: '/app/slxx', name: 'slxx', component: slxx, meta: { level:2, } },

  // 员工信息
  { path: '/app/ygxx', name: 'ygxx', component: ygxx, meta: { level:2, } },

  // 羊只信息
  { path: '/app/yzxx', name: 'yzxx', component: yzxx, meta: { level:2, } },
  
  // 体测安排
  { path: '/app/tcap', name: 'tcap', component: tcap, meta: { level:2, } },
  { path: '/app/tcap/add', name: 'tcap_add', component: tcap_add, meta: { level:3, } },

  // 配种
  { path: '/app/pzrw', name: 'pzrw', component: pzrw, meta: { level:2, } },
  { path: '/app/pzjh', name: 'pzjh', component: pzjh, meta: { level:2, } },
  { path: "/app/userGroup",name:"userGroup",component:userGroup,meta:{level : 2}},
  { path: "/app/userGroupAdd",name:"userGroupAdd",component:userGroupAdd,meta:{level:2}},
  { path:"/test",name:"test",component:test,meta:{level:2}}

  
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.NODE_ENV === 'production' ? '${your path}' : ''),
  routes: routes, // `routes: routes` 的缩写

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router