<template>
  <div class="div-input">
    <van-nav-bar title="员工信息" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>
    <van-row
      style=" position:fixed; top:46px; left: 0; right: 0; border-top: 1px solid #eee;background: #FFF; padding: 10px">
      <van-col span="9" class="input-cell">
        <van-field class="input-class" v-model="searchText" placeholder="输入姓名..." />
      </van-col>
      <van-col span="9" class="input-cell">
        <van-field v-model="groupText" class="input-class" placeholder="选择组别..." is-link arrow-direction="down"
          @click="showPicker = true" />
      </van-col>
      <van-col span="6">
        <van-button type="primary" class="search-btn-class" @click="queryStaff">查找</van-button>
      </van-col>
    </van-row>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker title="组别" :columns="option_type" @confirm="onConfirm" @cancel="clearGroup" cancel-button-text="清空" />
    </van-popup>

    <van-row class="title">
      <van-col span="5">组别</van-col>
      <van-col span="4">姓名</van-col>
      <van-col span="5">岗位</van-col>
      <van-col span="2">性别</van-col>
      <van-col span="3">年龄</van-col>
      <van-col span="5">入职时间</van-col>
    </van-row>

    <div style="margin-top: calc(65px + 2em + 20px);">
      <van-list :immediate-check="false" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
       >
        <van-row :class="['row', (index % 2 == 1) ? '' : 'odd']" v-for="(row, index) in list" :key="index">
          <van-col span="5">{{ row.group }}</van-col>
          <van-col span="4">{{ row.name }}</van-col>
          <van-col span="5">{{ row.postion }}</van-col>
          <van-col span="2">{{ row.gender }}</van-col>
          <van-col span="3">{{ row.age }}</van-col>
          <van-col span="5">{{ row.entry_date }}</van-col>
        </van-row>
      </van-list>
    </div>
  </div>
</template>
<script>

import axios from 'axios'

const exampleData = {
  group: "繁育1组", name: "上官婉儿", postion: "巡视员", gender: "女", age: 24, entry_date: "2018-09-01"

}

export default {
  name: "ygxx",
  data() {
    return {
      searchText: null,

      groupNo: null,
      groupText: null,
      option_type: [
        { value: "1", text: "组别1", },
        { value: "2", text: "组别2", },
        { value: "3", text: "组别3", },
        { value: "9", text: "组别4", },
      ],
      showPicker: false,

      list: [],
      loading: false,
      finished: false,
      //
      //listData: {}
    }
  },
  created(){
    //console.log("444")
    this.onLoad()
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    initPage() {
      this.showPicker = false
      this.groupNo = null
      this.groupText = null
      this.searchText = null

      this.list = []
      this.loading = false
      this.finished = false
      //
      //this.listData = {}
    },

    onConfirm(item) {
      this.groupNo = item.value
      this.groupText = item.text
      this.showPicker = false
    },

    clearGroup() {
      this.showPicker = false
      this.groupNo = null
      this.groupText = null
      this.searchText = null
    },


    queryStaff(){//查找按键的单击事件
      
      if(this.groupText=="组别1"){
          this.groupNo=1
      }
      if(this.groupText=="组别2"){
          this.groupNo=2
      }
      if(this.groupText=="组别3"){
          this.groupNo=3
      }
      if(this.groupText=="组别4"){
        this.groupNo=9
      }
     

      
    let res=axios.post("",  {
        act: "api_staff_list",
        name: this.searchText,
        team_id: this.groupNo
      },{
        no_loading: true,
      }).then((res) => {

      
      console.log(res)
        

        let data = res.data
        let arr = []
        for (let i = 0; i < data.staff_list.length; i++) {
          // this.list.push(data.staff_list[i]);
          let item = data.staff_list[i];
          let obj = {
            group:item.team_name,
            name:item.name,
            postion:item.position,
            gender:item.sex,
            age:item.age,
            entry_date:item.entry_time
          }
          arr.push(obj)
         
        }
        this.list = arr;
        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }


  
        
     
      })
      
      
     
    },


  

    onLoad() {
      this.loading = true;

      //
      let res = axios.post("", {
        act: "api_staff_list",
        name: this.searchText,
        team_id: this.groupNo
      }, {
        no_loading: true,
      }).then((res) => {
        //console.log(res)
        let data = res.data
        let arr = []
        for (let i = 0; i < data.staff_list.length; i++) {
          // this.list.push(data.staff_list[i]);
          let item = data.staff_list[i];
          let obj = {
            group:item.team_name,
            name:item.name,
            postion:item.position,
            gender:item.sex,
            age:item.age,
            entry_date:item.entry_time
          }
          arr.push(obj)
          //console.log(arr)
          // this.listData.team_name += data.staff_list[i].team_name
          // this.listData.name += data.staff_list[i].name
          // this.listData.postion += data.staff_list[i].postion
          // this.listData.sex += data.staff_list[i].sex
          // this.listData.age += parseInt(data.staff_list[i].age)
          // this.listData.entry_date += data.staff_list[i].entry_date
        }
        this.list = arr;

        if (!res || res.code != 0 || !res.data) {
          this.loading = false
          this.finished = true
          return
        }

      }

      )


      // this.listData = {
      //   group: "繁育1组", name: "上官婉儿", postion: "巡视员", gender: "女", age: 24, entry_date: "2018-09-01"
      // }

      // console.log(res)
      // let data = res.data
      // for (let i = 0; i < data.staff_list.length; i++) {
      //   this.list.push(data.staff_list[i]);
      //   this.listData.team_name += data.staff_list[i].team_name
      //   this.listData.name += data.staff_list[i].name
      //   this.listData.postion += data.staff_list[i].postion
      //   this.listData.sex += data.staff_list[i].sex
      //   this.listData.age += parseInt(data.staff_list[i].age)
      //   this.listData.entry_date += data.staff_list[i].entry_date
      // }

      // 加载状态结束
      this.loading = false;

      // if (!data.has_more) {
      //   this.finished = true
      // }

      setTimeout(() => {
        // for (let i = 0; i < 20; i++) {
        //   this.list.push(listData)
        // }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 100) {
          this.finished = true;
        }
      }, 1000)
    },



    //改动结束
    // setTimeout(() => {
    //   for (let i=0; i<20; i++) {
    //     this.list.push(listData)
    //   }

    //   // 加载状态结束
    //   this.loading = false;

    //   // 数据全部加载完成
    //   if (this.list.length >= 100) {
    //     this.finished = true;
    //   }
    // }, 1000)
    // },
  },

  activated() {
    this.initPage()
    this.onLoad()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.showPicker) {
        leave = false
        this.showPicker = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.input-cell {
  position: relative;
  padding: 0 5px;
}

.input-class {
  background: #f8f8f8;
  border-radius: var(--van-border-radius-lg);
}

.div-title {
  padding: 12px 0;
  position: absolute;
  top: 0;
  left: 0;
}

.search-text-label {
  margin: 0;
}

.search-btn-class {
  border-radius: 20px;
}

.title {
  position: fixed;
  top: calc(65px + 46px);
  padding: 10px 0;
  font-size: .8em;
  color: #888;
  width: 100vw;
  background: #FFF;
  line-height: 2em;
}

.row {
  padding: 10px 0;
  font-size: .8em;
  line-height: 2em;
}

.row.odd {
  background: #EEE;
}
</style>