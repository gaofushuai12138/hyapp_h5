<template>
  <div>
    <div :id="aaa"></div>
    Me {{aaa}} {{ title }}
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <br />
    11111
    <router-link to="/about?aaa=45678">to about 45678</router-link>
    <van-cell-group>
      <van-cell title="选择单个日期" :value="date" @click="show = true"/>
      <van-calendar v-model:show="show" @confirm="onConfirm" @select="onSelect"/>

      <van-cell is-link @click="showPopup">展示弹出层</van-cell>
      <van-popup v-model:show="showp" :closeable="true"
        position="top" :style="{ height: '30%' }">内容</van-popup>
    </van-cell-group>
    
  </div>
</template>
<script>
import {useRoute} from "vue-router"   //1.引入useRoute

export default {
  name: 'Me',

  data() {
    return {
      aaa: "",

      timer: null,
      title: 0,

      date: null,
      show: false,

      showp: false,
    }
  },

  methods: {
    resetInteval() {
      if (this.timer) {
        clearInterval(this.timer)
      }

      let that = this
      this.title = 0
      this.timer = setInterval(() => {
        that.title++
      }, 1000)
    },

    closeInteval() {
      clearInterval(this.timer)
      this.timer = null
    },

        
    onConfirm(value) {
      const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`

      this.date = formatDate(value)
      this.show = false
      console.info(this.date)
    },

    onSelect(value) {
      // // 先关闭再后退
      // this.show = false

      // 此处后退，会触发popstate事件，而不是click或者tap事件
      this.$router.back()
    },

    showPopup() {
      this.showp = true
    },


  },

  created() {

  },

  // keep-alive时有效
  activated() {
    let {aaa} = useRoute().query
    console.info("Me, activated:" + aaa)
    this.aaa = aaa

    this.resetInteval()
  },

  beforeMount() {
  },

  mounted() {
    console.info("Me, mounted")
    // this.resetInteval()
  },

  unmounted() {
    this.closeInteval();

    console.info("Me, unmonted")
  },

  beforeRouteUpdate(to, from, next) {
    console.info("Me beforeRouteUpdate")
  },

  beforeRouteLeave(to, form, next) {
    console.info("Me, beforeRouteLeave " + "[" + window.event.type + "]", to)

    let leave = true

    // popstate事件触发条件：
    // 1: 按后退按钮
    // 2: this.$router.back
    if (window.event.type === "popstate") {
      if (this.show || this.showp) {
        leave = false

        this.show = false
        this.showp = false
      }
    }

    next(leave)
    

    /*
    不调用next，路由改变，页面不变
     */

    // // 后退有效，路由改变
    // // 等同于 next(true)
    // next()s

    // // 后退无效，路由不变
    // next(false)


  },

  setup() {
  },
}
</script>
<style scoped>
.main-div {
  background: rgba(255,0,0,.1);
}
</style>