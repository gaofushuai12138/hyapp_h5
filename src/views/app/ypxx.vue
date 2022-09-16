<template>
  <div>
    <van-nav-bar title="药品信息" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 库存信息 </template>
        <div ref="barnlist" class="tab-div" @scroll.passive="onScroll0">
          <van-row class="title" >
            <van-col span="5">药品名称</van-col>
            <van-col span="4">当前库存</van-col>
            <van-col span="4">总入库</van-col>
            <van-col span="4">总出库</van-col>
            <van-col span="7">预计使用天数</van-col>
          </van-row>
      
          <div>
            <van-row :class="['row', (index % 2 == 1) ? '' : 'odd']" v-for="(row, index) in list0" :key="index" >
              <van-col span="5">{{row.medical_name}}</van-col>
              <van-col span="4">{{row.this_stock}} </van-col>
              <van-col span="4">{{row.total_input}}</van-col>
              <van-col span="4">{{row.total_output}}</van-col>
              <van-col span="7">{{row.days}}</van-col>
            </van-row>
          </div>
        </div>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title>
          统计信息
        </template>
        <div class="div-input tab-div">
          <van-row class="search-row" justify="space-between">
            <van-col span="3" class="search-row-title">
              <span>时间</span>
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-cell style="height: 44px;" :value="dateFrom" @click="showDateFrom = true" value-class="date-class" />
              </van-cell-group>
            </van-col>
            <van-col span="1" style="line-height: 44px; font-size: .8em; color: #888">
              <span>至</span>
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-cell style="height: 44px;" :value="dateTo" @click="showDateTo = true" value-class="date-class" />
              </van-cell-group>
            </van-col>
          </van-row>
          <!-- <van-row class="search-row" justify="space-between">
            <van-col span="3"  class="search-row-title">
              <span>组别</span>
            </van-col>
            <van-col span="11">
            </van-col>
            <van-col span="10">
              <van-cell-group inset>
                <van-field v-model="groupText" is-link arrow-direction="down" @click="showPicker = true">
                </van-field>
              </van-cell-group>
            </van-col>
          </van-row> -->
          <van-row class="search-row" justify="space-between">
            <van-col span="3"  class="search-row-title">
              <span>药品名</span>
            </van-col>
            <van-col span="21">
              <van-cell-group inset>
                <!-- <van-field v-model="medical_name"> -->
                <van-field v-model="medicalText" is-link arrow-direction="down" @click="showPicker1 = true"></van-field>
              </van-cell-group>
            </van-col>
          </van-row>
          <van-row class="search-row" justify="space-between">
            <van-col span="3"  class="search-row-title">
              <span>组别</span>
            </van-col>
          
            <van-col span="10">
              <van-cell-group inset>
                <van-field v-model="groupText" is-link arrow-direction="down" @click="showPicker = true">
                </van-field>
              </van-cell-group>
            </van-col>
            <van-col span="11">
              <van-button round type="success" color="#1989fa" @click="queryMedical">查找</van-button>
            </van-col>
          </van-row>
          <div v-for="(listrow, index) in list1" :key="index" class="list-row">
            <div class="list-row-header">
              {{listrow.name}}
            </div>
            <div class="list-row-body">
              <div :ref="'char_' + listrow.id" :id="'char_' + listrow.id" style="width: 100%; height: 70vw;">

              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-calendar v-model:show="showDateFrom" :show-confirm="false" :min-date="new Date(2021, 7, 1)" @select="onConfirmFrom" />
    <van-calendar v-model:show="showDateTo" :show-confirm="false" :min-date="new Date(2021, 7, 1)" @select="onConfirmTo" />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        title="组别"
        :columns="option_group"
        @confirm="onConfirmGroup"
        @cancel="clearGroup"
        cancel-button-text="清空"
      />
    </van-popup>
    <van-popup v-model:show="showPicker1" position="bottom">
      <van-picker
        title="药品名"
        :columns="option_medical"
        @confirm="onConfirmMedical"
        @cancel="clearMedical"
        cancel-button-text="清空"
      />
    </van-popup>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import {Toast} from 'vant'
import axios from 'axios'
import { Dialog } from 'vant'

const option_group = [
  // { value: "1", text: "组别1" },
  // { value: "2", text: "组别2" },
  // { value: "3", text: "组别3" },
  // { value: "9", text: "组别4" },
]
const option_medical = [
 // { value: "56", text: "0.9%氯化钠注射液" }
]
const exampleData = {
  medical_name: "药品", this_stock: 20940, total_input: 36780, total_output: 25778, days: 60
}
export default {
  name: "ypxx",
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

      option_medical,
      medical:null,
      medicalText: null,
      showPicker1: false,

      medical_name:"",
    }
  },

  methods: {
    initPage() {
      this.actIndex = 0

      this.list0 = []
      this.sum0 = {}
      this.scrollTop0 = 0

      this.list1 = []
      // this.list1 = [{ id:"c1", name : "药品出库折线图" },
      //     { id:"c2", name : "药品入库折线图" }]
      this.showDateFrom = false
      this.dateFrom = null
      this.showDateTo = false
      this.dateTo = null

      this.group = null
      this.groupText = null
      this.showPicker = false

      this.medical = null
      this.medicalText = null
      this.showPicker1 = false

      this.medical_name = ""
    },

    onClickLeft() {
      history.back()
    },
    
    onLoad0() {

      let res = axios.post("", {
        act: "api_medical_stock",
        
      }, {
        no_loading: true,
      }).then((res) => {
        //console.log(res)
        let data = res.data
        let arr = []
        arr.push({
          medical_name: "药品", this_stock: 0, total_input: 0, total_output: 0, days: 0});
        for (let i = 0; i < data.medical_list.length; i++) {
          // this.list.push(data.staff_list[i]);
          let item = data.medical_list[i];
          let obj = {
            medical_name:item.m_name,
            this_stock:item.m_stock,
            total_input:item.m_in_stock,
            total_output:item.m_out_stock,
            days:item.expect_days
            
          }
          arr.push(obj)
          
        }
        this.list0 = arr;

        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }

      }

      )
      
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

    onConfirmMedical(item) {
      this.medical = item.value
      this.medicalText = item.text
      this.showPicker1 = false
    },

    clearGroup() {
      this.group = null
      this.groupText = null
      this.showPicker = false
    },
    
    clearMedical() {
      this.medical = null
      this.medicalText = null
      this.showPicker1 = false
    },


    queryMedical(){
      
      axios.post("",  {
        // act: "api_forage_statistics",
        // "datetime_from":"2021-10-30",
        // "datetime_to":"2021-11-5",
        // "team_id":"9",
        // "forage_id":"9"
        act: "api_medical_statistics",
        "datetime_from":this.dateFrom,
        "datetime_to": this.dateTo,
        "team_id":this.group,
        "medical_id":this.medical
      },{
        no_loading: true,
      }).then((res) => {
        if (!res || res.code != 0 || !res.data||res.data.has_more==false) {
          if(res.data.has_more==false){
            Dialog.alert({message:"无相关数据"});
          }else{
            Dialog.alert({message:"错误"});
          }
          return
        }else{
          
        //console.log(res)
        setTimeout(() => {
        this.list1 = [
          { id:"c1", name : "药品出库折线图" },
          { id:"c2", name : "药品入库折线图" },
        ]
        
     
        this.list1[1].data=res.data.medical_list[0].out_data[0].out_num
        this.list1[0].data=res.data.medical_list[0].in_data[0].in_num

        
        this.list1[1].days=res.data.medical_list[0].out_data[0].out_date
        this.list1[0].days=res.data.medical_list[0].in_data[0].in_date
        
      
       

        this.drawChart()
      }, 1000)

    }
    })
      
    
    },

    onLoad1() {

      axios.post("", {
        act: "api_medical_teamselect",
        
      }, {
        no_loading: true,
      }).then((res) => {
        //console.log(res)
        let arr = []
        arr.push({
          value:null, text:"所有组" });
        for (let i = 0; i < res.data.team_list.length; i++) {
          let item = res.data.team_list[i];
          let obj = {
            value:item.team_id,
            text:item.team_name,
          }
          arr.push(obj)
        
        }
        this.option_group = arr;

        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }

      }

      )
      


      axios.post("", {
        act: "api_medical_select",
        
      }, {
        no_loading: true,
      }).then((res) => {
        //console.log(res)
        let arr = []
        for (let i = 0; i < res.data.medical_list.length; i++) {
          let item = res.data.medical_list[i];
          let obj = {
            value:item.medical_id,
            text:item.m_name,
          }
          arr.push(obj)
        
        }
        this.option_medical = arr;

        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }

      }

      )



      setTimeout(() => {
        this.list1 = [
          { id:"c1", name : "药品出库折线图" },
          { id:"c2", name : "药品入库折线图" },
         
        ]

        this.list1 = this.list1.map((row) => {
          let data = []
          for (let i=0; i < this.list1.length; i++) {
            data.push(0)
          }
          row.data = data
          return row
        })

        setTimeout(this.drawChart, 1000)
      }, 1000)
    },

    drawChart() {
      

      let mycharts = []
      for (let i=0; i < 2; i++) {
        let myChart = echarts.init(document.getElementById("char_" + this.list1[i].id));
        // 绘制图表
        myChart.setOption({
          // title: { text: this.list1[i].name },
          tooltip: {
          },
          // grid: {
          //  x: 60,
          //  y: 35,
          //  x2: 15,
          //  y2: 35,
          //  borderWidth: 1,
          // },
          xAxis: {
            data: this.list1[i].days,
            type: 'category',
          },
          yAxis: {
            // name: this.list1[i].name,
          },              
          series: [
            {
              smooth: true,
              name: this.list1[i].name,
              type: "line",
              data: this.list1[i].data,
            },
          ],
        });

        mycharts.push(myChart)
      }
    }
  },

  mounted() {
  },

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
    if (window.event.type === "popstate") {
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
  background: #FFF;
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
  font-size: .8em;
  color: #888;
  width: 100vw;
  background: #FFF;
  line-height: 2em;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.row {
  padding: 10px 0;
  font-size: .8em;
  line-height: 2em;
}
.row.odd {
  background: #EEE;
}

.search-row {
  padding: 5px 0 5px 10px;
  box-sizing: border-box;
}

.search-row-title {
  line-height: 44px; 
  font-size: .9em; 
  font-weight: bold; 
  color: #333; 
  text-align: left;
}
</style>
