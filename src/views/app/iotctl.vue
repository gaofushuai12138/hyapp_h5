<template>
  <div>
    <van-nav-bar title="物联网控制" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 设备状态 </template>
        <IotctlStatus ref="iotctlStatus" :abnormaltypeOption="option_abnormaltype" :abnormaltypeParam="abnormaltype0" @showAbnormal="showAbnormalPicker2 = true"></IotctlStatus>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title>
          <van-badge dot> 数据 </van-badge>
        </template>
        <div ref="datalist1" class="tab-div" @scroll.passive="onScroll1">
          <van-list
            :immediate-check="false"
            v-model:loading="loading1"
            :finished="finished1"
            finished-text="没有更多了"
            @load="onLoad1"
          >
            <div v-for="(listrow, index) in list1" :key="index" class="list-row" @click="onSelectRow1(listrow.id)">
              <div class="list-row-header ">
                {{listrow.name}}
                <van-icon name="arrow" class="right"/>
              </div>
              <div class="list-row-body">
                <van-row justify="space-between" v-for="(item, index2) in listrow.data" :key="index2" class="iotctl-grouprow">
                  <van-col span="11">
                    <span :style="{ 'color': item.color }">{{item.name}}</span>
                    <span class="iotctl-grouprow-switch">
                      {{item.value}}
                    </span>
                  </van-col>
                  <van-col span="12">
                     {{item.unit}}
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab name="2" class="tab-contain">
        <template #title> 视频 </template>
        <div ref="datalist2" class="tab-div with-search" @scroll.passive="onScroll2">
          <van-row justify="space-between" style=" position:absolute; top:0; border-top: 1px solid #eee;background: #FFF;padding: 10px; right: 0; left: 0;">
            <van-col span="8">
              <van-cell class="input-class" :title="abnormalText2" 
                title-class="van-ellipsis" 
                :title-style="abnormalTextClass2"
                is-link arrow-direction="down" 
                @click="showAbnormalPicker2 = true" ></van-cell>
            </van-col>
            <van-col span="9">
              <van-field class="input-class" v-model="searchText2" />
            </van-col>
            <van-col span="5">
              <van-button type="primary" class="search-btn-class">查找</van-button>
            </van-col>
          </van-row>
          <van-list
            :immediate-check="false"
            v-model:loading="loading2"
            :finished="finished2"
            finished-text="没有更多了"
            @load="onLoad2"
          >
            <div v-for="(listrow, index) in list2" :key="index" class="list-row" @click="onSelectRow2(listrow.id)">
              <div class="list-row-header ">
                {{listrow.name}}
                <!-- <van-icon name="arrow" class="right"/> -->
              </div>
              <div class="list-row-body">
                <van-row justify="space-between" v-for="(group, index2) in listrow.data" :key="index2" class="iotctl-grouprow">
                  <van-col span="11" v-for="(item, index3) in group" :key="index3">
                    <van-image :src="item.src" class="monitor-img"></van-image>
                    <div class="monitor-img-text">{{item.name}}</div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>

    <van-popup v-model:show="showAbnormalPicker2" position="bottom">
      <van-picker
        title="异常类型"
        :columns="option_abnormaltype"
        @confirm="onConfirm2"
        @cancel="clearAbnormal2"
        cancel-button-text="清空"
      />
    </van-popup>
  </div>
</template>
<script>
import {Toast} from "vant"
import IotctlStatus from '@/components/iotctl/status.vue'

const exampleData1 = [
  { name: "氨气", value: '12', unit:"mg/L", color: "#009DFF", },
  { name: "硫化氢", value: '2', unit:"mg/L", color: "#22E4FF", },
  { name: "温度", value: '23', unit:"℃", color: "#3BFFD0", },
  { name: "湿度", value: '54', unit:"%", color: "#04E38A", },
]

const exampleData2 = [
  { name: "西向东", img: ''}, { name: "东向西", img: ''}, 
  { name: "北部西向东", img: ''}, { name: "北部东向西", img: ''}, 
  { name: "南部西向东", img: ''}, { name: "南部东向西", img: ''},
]

export default {
  name: "iotctl",
  components: {
    IotctlStatus,
  },
  data() {
    return {

      actIndex: '0',
      option_abnormaltype: [],
      abnormaltype0: null,

      showAbnormalPicker2: false,
      abnormaltype2: null,
      searchText2: "",

      list1: [],
      loading1: false,
      finished1: false,
      scrollTop1: 0,

      list2: [],
      loading2: false,
      finished2: false,
      scrollTop2: 0,
    }
  },

  computed: {
    abnormalText2() {
      return this.abnormaltype2 ? this.abnormaltype2.text : "异常类型..."
    },
    abnormalValue2() {
      return this.abnormaltype2 ? this.abnormaltype2.value : null
    },
    abnormalTextClass2() {
      let s = { "text-align": "left" }
      if (this.abnormalValue2 == null || this.abnormalValue2 == undefined) s["color"] = "#aaa"
      return s
    },
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    initPage() {
      this.actIndex = '0'

      this.option_abnormaltype = [
        { value: "a", text: "异常1", },
        { value: "b", text: "异常2", },
        { value: "c", text: "异常3", },
        { value: "d", text: "异常4", },
      ]

      this.showAbnormalPicker2 = false
      this.abnormaltype2 = null
      this.searchText2 = ""

      this.list1 = []
      this.loading1 = false
      this.finished1 = false
      this.scrollTop1 = 0

      this.list2 = []
      this.loading2 = false
      this.finished2 = false
      this.scrollTop2 = 0
    },


    onConfirm2(item) {
      if (this.actIndex == "0") {
        this.abnormaltype0 = item
      } else {
        this.abnormaltype2 = item
      }
      
      this.showAbnormalPicker2 = false
    },

    clearAbnormal2() {
      this.showAbnormalPicker2 = false
      if (this.actIndex == "0") {
        this.abnormaltype0 = null
      } else {
        this.abnormaltype2 = null
      }
    },

    onLoad1() {
      setTimeout(() => {
        for (let i=0; i<6; i++) {
          this.list1.push({ id:"A"+(this.list1.length+1), name: "A"+(this.list1.length+1), data: exampleData1, })
        }

        // 加载状态结束
        this.loading1 = false;

        // 数据全部加载完成
        if (this.list1.length >= 20) {
          this.finished1 = true;
        }
      }, 1000)
    },

    onSelectRow1(iotId) {
      Toast(iotId)
      // this.$router.push({
      //   path: "/app/iotctl/setting",
      //   query: {
      //     id : iotId
      //   }
      // })
    },

    onScroll1(e) {
      this.scrollTop1 = e.srcElement.scrollTop
    },

    onLoad2() {
      setTimeout(() => {
        for (let i=0; i<6; i++) {
          let groupdata = _.chunk(exampleData2, 2)

          this.list2.push({ id:"A"+(this.list2.length+1), name: "A"+(this.list2.length+1), data: groupdata, })
        }

        console.info(this.list2)

        // 加载状态结束
        this.loading2 = false;

        // 数据全部加载完成
        if (this.list2.length >= 20) {
          this.finished2 = true;
        }
      }, 1000)
    },

    onSelectRow2(videoId) {
      Toast(videoId)
    },

    onScroll2(e) {
      this.scrollTop2 = e.srcElement.scrollTop
    },
  },

  activated() {
    console.info("iotctl activated")
    if (this.$route.isback && this.scrollTop0 > 0) {
      this.$refs.datalist1.scrollTop = this.scrollTop1
      this.$refs.datalist2.scrollTop = this.scrollTop2
    }

    if (!this.$route.isback) {
        this.initPage()

        this.onLoad1()
        this.onLoad2()
    }
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.showAbnormalPicker || this.inloading) {
        leave = false

        this.inloading = false
        this.showAbnormalPicker = false
        this.showAbnormalPicker2 = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.tab-div {
  height: calc(100vh - 44px - 46px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  border-top: 1px solid #eee;
}

.tab-div.with-search {
  height: calc(100vh - 44px - 46px - 65px);
  margin-top: 65px;
}

.input-class {
  background: #f8f8f8;
  border-radius: var(--van-border-radius-lg);
}

.search-btn-class {
  border-radius: 20px;
}

.list-row-header {
  font-weight: bold;
  border-left: 1px solid #1989fa;
  padding-left: 8px;
}

.iotctl-grouprow {
  padding: 4px 0;
}

.iotctl-grouprow-switch {
  float: right;
}

.monitor-img {
  width: 100%;
  height: calc((50vw - 30px) * 9 / 16);
}
.monitor-img-text {
  text-align: center;
  margin-bottom: 4px;
}
</style>
