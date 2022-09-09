<template>
  <div
    class="home-swan-ctn add-nav-bar"
    ref="homeSwanCtn"
    @scroll.passive="onScroll"
  >
    <van-nav-bar
      :title="store_org.org_name"
      class="nav-bar-top title-text-align-left"
    >
      <template #left>
        <van-image
          width="var(--van-tabbar-item-icon-size)"
          :src="require('@/assets/icon/slider.png')"
          @click="clickSelectOrg"
        ></van-image>
      </template>
      <template #right>
        <van-badge dot>
          <van-image
            width="var(--van-tabbar-item-icon-size)"
            :src="require('@/assets/icon/message.png')"
            @click="clickMsg"
          ></van-image>
        </van-badge>
      </template>
    </van-nav-bar>
    <!-- <van-image width="100%" height="calc(100vh/4)"
      src=""
    /> -->
    <div id="customerChart" width="100%" height="calc(100vh/4)"></div>

    <van-grid square :border="false" :column-num="4">
      <van-grid-item
        v-for="(app, index) in app_list"
        :key="index"
        class="grid-class"
      >
        <div
          van-button
          class="app-cub"
          v-if="app.name != null"
          @click="onSelectApp(app.path)"
        >
          <van-image
            width="10vw"
            height="10vw"
            fit="container"
            :src="app.img"
          />
          <div class="name">{{ app.name }}</div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { Toast } from 'vant'
import { inject } from 'vue'
import axios from 'axios'
import { userInfo } from '@/plugin/dsbridge'

export default {
  name: 'HomeMainBoard',
  data() {
    return {
      scrollTop: 0,
      mainHeight: 0,
    }
  },
  computed: mapState(['store_org', 'app_list']),

  watch: {
    store_org(newOrg) {
      this.drawPage()
    },
  },

  mounted(){
    console.log(this.app_list)
  },
  methods: {
    onScroll(e) {
      this.scrollTop = e.srcElement.scrollTop
    },

    onSelectApp(appName) {
      if (appName) {
        this.$router.push(appName)
      } else {
        Toast(appName)
      }
    },

    clickMsg() {
      this.$emit('gotoMsg', {})
      // this.$router.push({path:"/msgdetail",params:{type:"warning"}});
      
    },

    clickSelectOrg() {
      this.$emit('selectOrg', {})
    },

    drawPage() {
      let len = 25
      let appList = []
      for (let i = 0; i < len; i++) {
        appList.push({
          id: i + 1,
          name: 'App_' + (i + 1),
          img: '',
        })
      }

      this.appList = appList

      let echarts = inject('ec') //引入
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('customerChart'))
        window.onresize = () => {
          //自适应大小
          this.myChart.resize()
        }
      }

      let data = []
      for (let i = 0; i < 6; i++) {
        data.push(Math.floor(Math.random() * 100))
      }
      // 绘制图表
      this.myChart.setOption({
        // title: { text: "总用户量" },
        tooltip: {},
        grid: {
          x: 40,
          y: 40,
          x2: 20,
          y2: 40,
        },
        xAxis: {
          data: ['12-3', '12-4', '12-5', '12-6', '12-7', '12-8'],
          type: 'category',
          axisTick: {
            //x轴刻度相关设置
            alignWithLabel: true,
          },
        },
        yAxis: {},
        series: [
          {
            name: '用户量',
            type: 'line',
            // data: [5, 20, 36, 10, 10, 20],
            data,
          },
        ],
      })
    },
  },

  mounted() {
    this.drawPage()
  },

  activated() {
    let that = this
    setTimeout(function () {
      if (that.scrollTop > 0) {
        that.$refs.homeSwanCtn.scrollTop = that.scrollTop
      }
    }, 500)
  },
}
</script>
<style scoped>
/* home页中组件使用 */
.nav-bar-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.nav-bar-top .van-nav-bar__title {
  margin-left: 50px;
}

.app-cub {
  position: relative;
  text-align: center;
  width: 100%;
  background: rgba(0, 0, 0, 0);
}
.app-cub .name {
  padding: 0 0 10px 0;
  font-size: 0.8em;
}

.app-cub:active {
  color: #1989fa;
}
.app-cub:active::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: ' ';
  background: rgba(200, 200, 200, 0.1);
}

#customerChart {
  width: 100%;
  height: 60vw;
}
</style>