<template>
  <div>
    <van-nav-bar title="羊只信息" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 存栏信息 </template>
        <div ref="barnlist" class="tab-div" @scroll.passive="onScroll0">
          <van-row class="title">
            <van-col span="4">组别</van-col>
            <van-col span="4">种母羊数</van-col>
            <van-col span="4">种公羊</van-col>
            <van-col span="4">肥育羊</van-col>
            <van-col span="4">基础母羊</van-col>
            <van-col span="4">羔羊</van-col>
          </van-row>

          <div>
            <van-row
              :class="['row', index % 2 == 1 ? '' : 'odd']"
              v-for="(row, index) in list0"
              :key="index"
            >
              <van-col span="4">{{ row.groupNo }}</van-col>
              <van-col span="4">{{ row.ewe0_num }} </van-col>
              <van-col span="4">{{ row.ram0_num }}</van-col>
              <van-col span="4">{{ row.fattening_num }}</van-col>
              <van-col span="4">{{ row.base_ewe_num }}</van-col>
              <van-col span="4">{{ row.lamb_num }}</van-col>
            </van-row>
          </div>

          <van-divider />
          <van-row class="row">
            <van-col span="4">{{ sum0.groupNo }}</van-col>
            <van-col span="4">{{ sum0.ewe0_num }} </van-col>
            <van-col span="4">{{ sum0.ram0_num }}</van-col>
            <van-col span="4">{{ sum0.fattening_num }}</van-col>
            <van-col span="4">{{ sum0.base_ewe_num }}</van-col>
            <van-col span="4">{{ sum0.lamb_num }}</van-col>
          </van-row>
          <van-button
            class="conner-add-button"
            type="primary"
            round
            to="/app/fygl/add"
            ><van-icon name="plus"
          /></van-button>
        </div>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title> 统计信息 </template>
        <div class="div-input tab-div">
          <van-row class="search-row" justify="space-between">
            <van-col
              span="3"
              style="
                line-height: 44px;
                font-size: 0.9em;
                font-weight: bold;
                color: #333;
              "
            >
              <span>时间</span>
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-cell
                  style="height: 44px"
                  :value="dateFrom"
                  @click="show = true"
                  value-class="date-class"
                />
              </van-cell-group>
            </van-col>
            <van-col
              span="1"
              style="line-height: 44px; font-size: 0.8em; color: #888"
            >
              <span>至</span>
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-cell
                  style="height: 44px"
                  :value="dateTo"
                  @click="show = true"
                  value-class="date-class"
                />
              </van-cell-group>
            </van-col>
          </van-row>
          <van-row class="search-row" justify="space-between">
            <van-col
              span="3"
              style="
                line-height: 44px;
                font-size: 0.9em;
                font-weight: bold;
                color: #333;
              "
            >
              <span>组别</span>
            </van-col>
            <van-col span="11"> </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-field
                  v-model="groupText"
                  is-link
                  arrow-direction="down"
                  @click="showPicker = true"
                >
                </van-field>
              </van-cell-group>
            </van-col>
          </van-row>
          <div v-for="(listrow, index) in list1" :key="index" class="list-row">
            <div class="list-row-header">
              {{ listrow.name }}
            </div>
            <div class="list-row-body">
              <div
                :ref="'char_' + listrow.id"
                :id="'char_' + listrow.id"
                style="width: 100%; height: 70vw"
              ></div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-calendar
      v-model:show="show"
      :show-confirm="false"
      @select="onConfirmFrom"
      :min-date="minDate" :max-date="maxDate"
    />
    <van-calendar
      v-model:show="showDateTo"
      :show-confirm="false"
      @select="onConfirmTo"
      :min-date="minDate" :max-date="maxDate"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        title="组别"
        :columns="option_group"
        @confirm="onConfirmGroup"
        @cancel="clearGroup"
        cancel-button-text="清空"
      />
    </van-popup>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { Toast } from 'vant'
import {ref} from 'vue';

const option_group = [
  { value: 'group1', text: '组别1' },
  { value: 'group2', text: '组别2' },
  { value: 'group3', text: '组别3' },
  { value: 'group4', text: '组别4' },
]
const exampleData = {
  groupNo: '繁育1组',
  ewe0_num: 20940,
  ram0_num: 3988,
  fattening_num: 13850,
  base_ewe_num: 1024,
  lamb_num: 15988,
}
export default {
  name: 'yzxx',
  setup(){
    const show = ref(false);
    return{
      show,
      minDate: new Date(2010,0,1),
      maxDate: new Date(2020,0,31)
    }
  },
  data() {
    return {
      actIndex: 0,

      list0: [],
      sum0: {},
      scrollTop0: 0,
     

      list1: [],
      loading1: false,
      finished1: false,

      showDateFrom: false,
      dateFrom: null,
      showDateTo: false,
      dateTo: null,

      option_group,
      group: null,
      groupText: null,
      showPicker: false,
    }
  },

  methods: {
    initPage() {
      this.actIndex = 0

      this.list0 = []
      this.sum0 = {}
      this.scrollTop0 = 0

      this.list1 = []

      this.showDateFrom = false
      this.dateFrom = null
      this.showDateTo = false
      this.dateTo = null

      this.group = null
      this.groupText = null
      this.showPicker = false
    },

    onClickLeft() {
      history.back()
    },

    onLoad0() {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list0.push(exampleData)
        }
        this.sum0 = {
          groupNo: '合计',
          ewe0_num: 1120940,
          ram0_num: 113988,
          fattening_num: 1113850,
          base_ewe_num: 111024,
          lamb_num: 1115988,
        }
      }, 1000)
    },

    onScroll0(e) {
      this.scrollTop0 = e.srcElement.scrollTop
    },

    checkDateRange(from, to) {
      if (from && to && from > to) {
        Toast('防疫计划日期范围不正确')
        return false
      }

      return true
    },
    onConfirmFrom(date) {
      this.showDateFrom = false

      let d = date.format('yyyy-MM-dd')
      if (!this.checkDateRange(d, this.dateTo)) {
        return
      }

      this.dateFrom = d
    },
    onConfirmTo(date) {
      this.showDateTo = false

      let d = date.format('yyyy-MM-dd')
      if (!this.checkDateRange(this.dateFrom, d)) {
        return
      }

      this.dateTo = d
    },

    onConfirmGroup(item) {
      this.group = item.value
      this.groupText = item.text
      this.showPicker = false
    },

    clearGroup() {
      this.group = null
      this.groupText = null
      this.showPicker = false
    },

    onLoad1() {
      setTimeout(() => {
        this.list1 = [
          { id: 'c1', name: '存量折线图' },
          { id: 'c2', name: '出生折线图' },
          { id: 'c3', name: '接种折线图' },
          { id: 'c4', name: '配种折线图' },
          { id: 'c5', name: '出库折线图' },
        ]

        this.list1 = this.list1.map(row => {
          let data = []
          for (let i = 0; i < 30; i++) {
            data.push(_.random(100, 2000))
          }
          row.data = data
          return row
        })

        setTimeout(this.drawChart, 1000)
      }, 1000)
    },

    drawChart() {
      let days = []
      for (let i = 0; i < 30; i++) days.push(i + 1)

      let mycharts = []
      for (let i = 0; i < this.list1.length; i++) {
        let myChart = echarts.init(
          document.getElementById('char_' + this.list1[i].id),
        )
        // 绘制图表
        myChart.setOption({
          // title: { text: this.list1[i].name },
          tooltip: {},
          xAxis: {
            data: days,
            type: 'category',
          },
          yAxis: {
            // name: this.list1[i].name,
          },
          series: [
            {
              smooth: true,
              name: this.list1[i].name,
              type: 'line',
              data: this.list1[i].data,
            },
          ],
        })

        mycharts.push(myChart)
      }
    },
  },

  mounted() {},

  activated() {
    if (this.$route.isback && this.scrollTop0 > 0) {
      this.$refs.barnlist.scrollTop = this.scrollTop0
    }

    if (!this.$route.isback) {
      this.initPage()
      this.onLoad0()
      this.onLoad1()
    }
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === 'popstate') {
      if (this.showDateFrom || this.showDateTo || this.showPicker) {
        leave = false
        this.showDateFrom = false
        this.showDateTo = false
        this.showPicker = false
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
  background: #fff;
  padding-bottom: 60px;
  border-top: 1px solid #eee;
}

.div-input {
  padding: 10px 0;
  min-height: calc(100vh - 44px - 46px);
  width: 100vw;
}

.list-row-header {
  font-weight: bold;
  border-left: 1px solid #1989fa;
  padding-left: 8px;
}

.title {
  position: fixed;
  top: 0;
  padding: 10px 0;
  font-size: 0.8em;
  color: #888;
  width: 100vw;
  background: #fff;
  line-height: 2em;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.row {
  padding: 10px 0;
  font-size: 0.8em;
  line-height: 2em;
}
.row.odd {
  background: #eee;
}

.search-row {
  padding: 5px 0;
  box-sizing: border-box;
}
</style>
