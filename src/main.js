import {} from '@/utils/DateUtil'
import { ParseJson } from '@/utils/StrUtil'
import _ from 'lodash'
import axios from 'axios'
import { createApp } from 'vue'
import router from '@/plugin/route'
import vant from '@/plugin/vant'
import { Toast } from "vant"
import store from '@/plugin/store'
import {userInfo, logout} from '@/plugin/dsbridge'
import App from '@/App.vue'
import startListen from "@/plugin/svrlistener"

window.$dsbridge = dsBridge

function getLoginInfo() {
  let us = ParseJson(userInfo.get())

  if (!us || !us.token) {
    logout()
    return false
  }

  // store.commit("store_userinfo", us)
  us.org_list = us.org_list || []
  store.state.userinfo = us
  store.state.store_org = (us.org_list || [])[0]
  // if (store_org) {
  //   store.state.app_list = store_org.func_list
  // } else {
  //   store.state.app_list = []
  // }

  return true
}

if (getLoginInfo() || window.$hyt_is_pc_browser === 'true' ) {
  initAxios() 

  // createApp(App).mount('#app')
  const app = createApp(App)

  vant.forEach(ve => {
    app.use(ve)
  })
  app.use(store)
  app.use(router)


  app.mount('#app')

  // 启动监听
  startListen(store)
}

function initAxios() {
  if (window.$hyt_is_pc_browser !== 'true') {
    axios.defaults.baseURL = 'http://hyapp.nongzongbu.com/';
  }
  
  // axios.defaults.headers.common['token'] = "11111";
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    if (window.$hyt_is_pc_browser === 'true') {
      config.url = '/api'
    }
    // 在发送请求之前做些什么
    // let us = ParseJson(userInfo.get())
    // if (!us || !us.token) {
    //   logout()
    //   return
    // }
    let us = store.state.userinfo
    if (!us || !us.token) {
      logout()
      return
    }

    config.headers["token"] = us.token

    if (config.no_loading !== true) {
      Toast.loading({
        duration: 0,
        message: "请稍等..."
      })
    }

    return config;
  }, function (error) {
    Toast.clear()
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {

    // alert(JSON.stringify(response))

    // 对响应数据做点什么
    Toast.clear()

    if (window.$hyt_is_pc_browser !== 'true') {
      if (response.status == 401) {
        logout()
        return
      }
    }

    let res = response.data

    if (res && res.data && res.data.push != undefined) {
      res.data = res.data[0]
    }
    return res;
  }, function (error) {
    // 对响应错误做点什么
    Toast.clear()

    return Promise.reject(error);
  });
}