<template>
  <div class="div-input">
    <van-nav-bar title="员工信息" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>
    <van-row style=" position:fixed; top:46px; left: 0; right: 0; border-top: 1px solid #eee;background: #FFF; padding: 10px">
      <van-col span="9" class="input-cell">
        <van-field class="input-class" v-model="searchText" placeholder="输入姓名..." />
      </van-col>
      <van-col span="9" class="input-cell">
        <van-field v-model="groupText" class="input-class" placeholder="选择组别..." 
          is-link arrow-direction="down" 
          @click="showPicker = true" />
      </van-col>
      <van-col span="6">
        <van-button type="primary" class="search-btn-class">查找</van-button>
      </van-col>
    </van-row>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        title="组别"
        :columns="option_type"
        @confirm="onConfirm"
        @cancel="clearGroup"
        cancel-button-text="清空"
      />
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
      <van-list
        :immediate-check="false"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-row :class="['row', (index % 2 == 1) ? '' : 'odd']" v-for="(row, index) in list" :key="index" >
          <van-col span="5">{{row.group}}</van-col>
          <van-col span="4">{{row.name}}</van-col>
          <van-col span="5">{{row.postion}}</van-col>
          <van-col span="2">{{row.gender}}</van-col>
          <van-col span="3">{{row.age}}</van-col>
          <van-col span="5">{{row.entry_date}}</van-col>
        </van-row>
      </van-list>
    </div>
  </div>
</template>
<script>
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
        { value: "a", text: "组别1", },
        { value: "b", text: "组别2", },
        { value: "c", text: "组别3", },
        { value: "d", text: "组别4", },
      ],
      showPicker: false,

      list: [],
      loading: false,
      finished: false,
    }
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
    },

    onLoad() {
      this.loading = true;
      setTimeout(() => {
        for (let i=0; i<20; i++) {
          this.list.push(exampleData)
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 100) {
          this.finished = true;
        }
      }, 1000)
    },
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
  top:0;
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