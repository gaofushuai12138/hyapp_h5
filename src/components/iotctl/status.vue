<template>
  <div ref="datalist0" class="tab-div with-search" @scroll.passive="onScroll0">
    <van-row justify="space-between" style=" position:absolute; top:0; border-top: 1px solid #eee;background: #FFF;padding: 10px;right: 0; left: 0;">
      <van-col span="8">
        <van-cell class="input-class" :title="abnormalText" 
          title-class="van-ellipsis" 
          :title-style="abnormalTextClass"
          is-link arrow-direction="down" 
          @click="showAbnormal" ></van-cell>
      </van-col>
      <van-col span="9">
        <van-field class="input-class" v-model="searchText" />
      </van-col>
      <van-col span="5">
        <van-button type="primary" class="search-btn-class">查找</van-button>
      </van-col>
    </van-row>
    <van-list
      :immediate-check="false"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad0"
    >
      <div v-for="(listrow, index) in list" :key="index" class="list-row" @click="onSelectRow0(listrow.id)">
        <div class="list-row-header">
          {{listrow.room_name}}
          <van-icon name="arrow" class="right"/>
        </div>
        <div class="list-row-body">
          <div>
            <van-row justify="space-between" v-for="(itemrow, index3) in group" :key="index3" class="iotctl-grouprow">
              <van-col span="11" v-for="(item, index4) in itemrow" :key="index4">
                <div>
                  喷淋
                  <span class="iotctl-grouprow-switch" :style="switchStatus[water_state].style">
                    {{switchStatus[water_state].name}}
                  </span>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- <div v-for="(group, index2) in listrow.data" :key="index2">
            <van-row justify="space-between" v-for="(itemrow, index3) in group" :key="index3" class="iotctl-grouprow">
              <van-col span="11" v-for="(item, index4) in itemrow" :key="index4">
                <div>
                  {{item.name}}
                  <span class="iotctl-grouprow-switch" :style="switchStatus[item.status].style">
                    {{switchStatus[item.status].name}}
                  </span>
                </div>
              </van-col>
            </van-row>
          </div> -->
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import {Toast} from "vant"
import axios from "axios"

const switchStatus = {
  off: { name: '关', },
  on: { name: '开', style: "color: green" },
  close: { name: '收', },
  stop: { name: '停', style: "color: blue" },
  open: { name: '放', style: "color: green" },
}
const exampleData = [
  [
    { name: "喷淋", status: 'on'},   // 0:关，1:开，2:收，3:停
  ],
  [
    { name: "卷膜1", status: 'stop'}, { name: "卷膜2", status: 'close'}, { name: "卷膜3", status: 'open'}, { name: "卷膜4", status: 'open'},
  ],
  [
    { name: "风扇1", status: 'off'}, { name: "风扇2", status: 'on'}, { name: "风扇3", status: 'on'}, 
  ],
  [
    { name: "灯1", status: 'on'}, { name: "灯2", status: 'off'}, { name: "灯3", status: 'on'}, 
  ],
]

export default {
  name: "IotctlStatus",
  props: ["abnormaltypeOption", "abnormaltypeParam"],
  data() {
    return {
      switchStatus: switchStatus,

      option_abnormaltype: [],
      abnormaltype: null,
      searchText: "",

      list: [],
      loading: true,
      finished: false,
      cp: 0,
      scrollTop: 0,
    }
  },

  watch: {
    abnormaltypeOption: {
      immediate: true,
      handler(val) {
        this.option_abnormaltype = val
      }
    },

    abnormaltypeParam: {
      immediate: true,
      handler(val) {
        this.abnormaltype = val
      }
    },
  },

  computed: {
    abnormalText() {
      return this.abnormaltype ? this.abnormaltype.text : "异常类型..."
    },
    abnormalValue() {
      return this.abnormaltype ? this.abnormaltype.value : null
    },
    abnormalTextClass() {
      let s = { "text-align": "left" }
      if (this.abnormalValue == null || this.abnormalValue == undefined) s["color"] = "#aaa"
      return s
    },
  },

  methods: {
    initPage() {
      this.abnormaltype = null
      this.searchText = ""

      this.list = []
      this.loading = true
      this.finished = false
      this.cp = 0
      this.scrollTop = 0

      this.doSearch(true)
    },

    showAbnormal() {
      this.$emit('showAbnormal')
    },
    
    async doSearch(isRefreshing) {
      if (isRefreshing) {
        this.finished = true
        this.list = []
        this.cp = 0
      }

      try {
        let res = await axios.post("",  {
          act: "api_iot_list",
          page: this.list.length == 0 ? 0 : this.cp,
          size: 20,
        },{
          no_loading: true,
        })

        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }

        this.cp += 1

        let data = res.data
        for (let i = 0; i < data.iot_list.length; i++) {
          this.list.push(data.iot_list[i]);
        }

        // 加载状态结束
        this.loading = false;

        if (!data.has_more) {
          this.finished = true
        }
      } catch(err) {
        this.loading = false
        this.finished = true
      }
    },

    onLoad0() {
      this.doSearch(false)
    },

    onSelectRow0(iotId) {
      this.$router.push({
        path: "/app/iotctl/setting",
        query: {
          id : iotId
        }
      })
    },

    onScroll0(e) {
      this.scrollTop = e.srcElement.scrollTop
    },
  },

  mounted() {
    console.info("status mounted")
    this.initPage()
  },

  activated() {
    console.info("status activated")
    if (this.$route.isback && this.scrollTop > 0) {
      this.$refs.datalist0.scrollTop = this.scrollTop
    }

    if (!this.$route.isback) {
        this.initPage()
    }
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
</style>