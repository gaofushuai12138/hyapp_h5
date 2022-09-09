import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      store_count: 0,
      store_org: {
        org_id: "",
        org_name: "天下牧业",
        org_ico: require("@/assets/icon/LOGO.png"),
        // img: require("@/assets/icon/all1.png"),
      },
      userInfo:{
      },
      app_list: [
        { name:"防疫管理", img:require("@/assets/icon/app/epidemic.png"), path:"/app/fygl" },
        { name:"饲喂管理", img:require("@/assets/icon/app/feed_mng.png"), path:"/app/swgl" },
        { name:"异常上报", img:require("@/assets/icon/app/abnormal_report.png"), path:"/app/ycsb" },
        { name:"物联网控制", img:require("@/assets/icon/app/iot_center.png"), path:"/app/iotctl" },
        { name:"清扫消毒计划", img:require("@/assets/icon/app/clean_plan.png"), path:"/app/qsxdrw" },
        { name:"药品信息", img:require("@/assets/icon/app/medical.png"), path:"/app/ypxx" },
        { name:"饲料信息", img:require("@/assets/icon/app/feed_info.png"), path:"/app/slxx" },
        { name:"员工信息", img:require("@/assets/icon/app/employee_info.png"), path:"/app/ygxx" },
        { name:"羊只信息", img:require("@/assets/icon/app/sheep_info.png"), path:"/app/yzxx" },
        { name:"体侧安排", img:require("@/assets/icon/app/body_test.png"), path:"/app/tcap" },
        { name:"配种任务", img:require("@/assets/icon/app/breed.png"), path:"/app/pzrw" },
        { name:"配种计划", img:require("@/assets/icon/app/breed.png"), path:"/app/pzjh" },
        { name:"全部应用", img:require("@/assets/icon/app/all_app.png"), path:"/app/allapp" },
      ],

      userinfo: null
    }
  },
  mutations: {
    store_setCount (state, num) {
      // console.info("mutations", num)
      state.store_count = num
    },

    store_userinfo (state, us) {
      state.userinfo = us
    },

    store_org (state, org) {
      state.store_org = org
    }
  }
})

export default store