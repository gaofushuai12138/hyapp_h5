<template>
  <div>
    <van-nav-bar title="个人信息">
    </van-nav-bar>
    userinfo
    <router-link to="/me?aaa=1">to Me {{ store_count }}</router-link>
    <br /><br /><br />
    <router-link to="/me?aaa=2">to Me2 {{ title }}</router-link>
    <br /><br /><br />
    <div>
      <button @click="doAlert">aaa</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: "userinfo",

  data() {
    return {
      timer: null,
      title: 0,
    }
  },

  computed: mapState([
    // 映射 this.store_count 为 store.state.store_count
    'store_count'
  ]),

  watch: {
    store_count(val1, val2) {
      // console.info("watch", val1, val2)
    }
  },

  methods: {
    ...mapMutations([
      'store_increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    ]),

    doAlert() {
      alert("aaaa")
    }
  },

  created() {
    let that = this
    this.title = 0
    this.timer = setInterval(() => {
      that.title++
    }, 1000)
  },

  mounted() {
    console.info("userinfo, mounted")
  },

  unmounted() {
    clearInterval(this.timer)
    this.timer = null

    console.info("userinfo, unmonted")
  },

  setup() {
    
  },
}
</script>
