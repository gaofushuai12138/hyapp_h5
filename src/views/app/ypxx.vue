<template>
  <div>
    <van-nav-bar title="药品信息" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 库存信息 </template>
        <div ref="barnlist" class="tab-div" @scroll.passive="onScroll0">
          <van-row class="title">
            <van-col span="5">药品名称</van-col>
            <van-col span="4">当前库存</van-col>
            <van-col span="4">总入库</van-col>
            <van-col span="4">总出库</van-col>
            <van-col span="7">预计使用天数</van-col>
          </van-row>
          <div>
            <van-row
              :class="['row', index % 2 == 1 ? '' : 'odd']"
              v-for="(row, index) in list0"
              :key="index"
            >
              <van-col span="5">{{ row.medical_name }}</van-col>
              <van-col span="4">{{ row.this_stock }} </van-col>
              <van-col span="4">{{ row.total_input }}</van-col>
              <van-col span="4">{{ row.total_output }}</van-col>
              <van-col span="7">{{ row.days }}</van-col>
            </van-row>
          </div>
        </div>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title> 统计信息 </template>
        <div class="div-input tab-div">
          <van-row class="search-row" justify="space-between">
            <van-col span="3" class="search-row-title">
              <span>时间</span>
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-cell
                  style="height: 44px"
                  :value="dateFrom"
                  @click="showDateFrom = true"
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
                  @click="showDateTo = true"
                  value-class="date-class"
                />
              </van-cell-group>
            </van-col>
          </van-row>
          <van-row class="search-row" justify="space-between">
            <van-col span="3" class="search-row-title">
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
          <van-row class="search-row" justify="space-between">
            <van-col span="3" class="search-row-title">
              <span>药品名</span>
            </van-col>
            <van-col span="21">
              <van-cell-group inset>
                <van-field v-model="medical_name"> </van-field>
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
      v-model:show="showDateFrom"
      :show-confirm="false"
      @select="onConfirmFrom"
    />
    <van-calendar
      v-model:show="showDateTo"
      :show-confirm="false"
      @select="onConfirmTo"
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

const option_group = [
  { value: 'group1', text: '组别1' },
  { value: 'group2', text: '组别2' },
  { value: 'group3', text: '组别3' },
  { value: 'group4', text: '组别4' },
]
const exampleData = {
  medical_name: '药品',
  this_stock: 20940,
  total_input: 36780,
  total_output: 25778,
  days: 60,
}
export default {
  name: 'ypxx',
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

      medical_name: '',
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

      this.medical_name = ''
    },

    onClickLeft() {
      history.back()
    },

    onLoad0() {
      setTimeout(() => {
        for (let i = 0; i < 40; i++) {
          let row = _.cloneDeep(exampleData)
          row.medical_name = row.medical_name + this.list0.length
          this.list0.push(row)
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
          { id: 'c1', name: '药品出库折线图' },
          { id: 'c2', name: '药品入库折线图' },
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
  padding: 5px 0 5px 10px;
  box-sizing: border-box;
}

.search-row-title {
  line-height: 44px;
  font-size: 0.9em;
  font-weight: bold;
  color: #333;
  text-align: left;
}
</style>
