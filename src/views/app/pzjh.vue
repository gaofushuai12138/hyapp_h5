<template>
  <div class="div-input">
    <van-nav-bar title="配种计划" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>
    <van-row style=" position:fixed; top:46px; left: 0; right: 0; border-top: 1px solid #eee;background: #FFF;padding: 10px;">
      <van-col span="6">
        <div class="div-title">栋号</div>
      </van-col>
      <van-col span="18">
        <van-field v-model="buildText" class="select-class" 
          is-link arrow-direction="down" 
          placeholder="请选择"
          @click="showPicker = true" />
      </van-col>
    </van-row>

    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        title="栋号"
        :columns="buildList"       
        @confirm="onConfirm"
        @cancel="clearBuild"
        cancel-button-text="清空"
      />
    </van-popup>

    <van-row class="title">
      <van-col span="6">母栏舍</van-col>
      <van-col span="6">母栏数</van-col>
      <van-col span="6">公羊号</van-col>
      <van-col span="6">公栏舍</van-col>
    </van-row>

    <div style="margin-top: calc(65px + 2em + 20px);" >
      

      <van-row :class="['row', (index % 2 == 1) ? '' : 'odd']" v-for="(row, index) in listData.list" :key="index" @load="onLoad()">
        <van-col span="6">{{row.hutch_name}}</van-col>
        <van-col span="6">{{row.female_cnt}} </van-col>
        <van-col span="6">
          <a v-if="!row.pre_male_id" class="goto-select-ram" @click="selectRam">选择种羊</a>
          <span v-if="row.pre_male_sn">{{row.pre_male_sn}}</span>
        </van-col>
        <van-col span="6">{{row.pre_huntch_name}}</van-col>
      </van-row>

    
    </div>

    <div class="bottom-button">
      <van-button type="primary" block round @click="onClickSubmit">查询</van-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'

const exampleData = {
  ewe_barn: "A0101", ewe_num: 10, ram_no: "G0280380", ram_barn: "A0609"
}
export default {
  name: "pzjh",
  data() {
    return {
      showPicker: false,
      buildNo: null,
      buildList: [],
      listData: {},

      //list: [],
    }
  },

  computed: {
    buildText() {
      return this.buildNo ? this.buildNo.text : ""
    },

    buildVal() {
      return this.buildNo ? this.buildNo.value : null
    }
  },

  methods: {
    initPage() {
      //this.actIndex = "s0"
      this.listData = {
        cp: 0,
        list: [],
        loading: true,
        finished: false,
        scrollTop: 0,
      }
    },

    onClickLeft() {
      history.back()
    },

    onConfirm(row) {
      this.buildNo = row
      //console.log(this.buildNo)
      this.showPicker = false
    },

    clearBuild() {
      this.showPicker = false
      this.buildNo = null
    },

    async doSearch(isRefreshing) {
      //this.loading = true;

      let listData = this.listData
      if (isRefreshing) {
        listData.finished = true
        listData.list = []
        listData.cp = 0
      }

      try {
        let res = await axios.post("",  {
          act: "api_breed_plan",
          //将room_ids
          //room_ids: this.buildVal
        },{
          no_loading: true,
        })

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }

        listData.cp += 1

        let data = res.data
        for (let i = 0; i < data.room_list.length; i++) {
          listData.list.push(data.room_list[i]);
        }

        // 加载状态结束
        listData.loading = false;

        if (!data.has_more) {
          listData.finished = true
        }
      } catch(err) {
        listData.loading = false
        listData.finished = true
      }

      //   this.list = res.data.room_list || []
      // } catch(err) {
      // } finally {
      //     this.loading = false
      //     this.finished = true
      // }    

    },


    async onClickSubmit(isRefreshing) {
      //this.loading = true;

      let listData = this.listData
      if (isRefreshing) {
        listData.finished = true
        listData.list = []
        listData.cp = 0
      }

      try {
        let res = await axios.post("",  {
          act: "api_breed_plan",
          //将room_ids
          room_ids: this.buildVal
        },{
          no_loading: true,
        })

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }

        listData.cp += 1

        let data = res.data
        for (let i = 0; i < data.room_list.length; i++) {
          listData.list.push(data.room_list[i]);
        }

        // 加载状态结束
        listData.loading = false;

        if (!data.has_more) {
          listData.finished = true
        }
      } catch(err) {
        listData.loading = false
        listData.finished = true
      }
    },

    async initBaseDate() {
      this.showPicker = false
      this.buildNo = null

      this.list = []

      let res = await axios.post("",  {
        act: "api_user_choosegroup",
        org_id: this.$store.state.store_org.org_id,
      })

      if (!res || res.code != 0 || !res.data) {
        return
      }

      let data = res.data
      this.buildList = data.room_list.map((r) => {
        return {
          value: r.room.r_id,
          text: r.room.r_name,
        }
      })
    }
  },

  activated() {
    // this.initBaseDate()
    // this.initPage()
    // this.doSearch()
    this.listData = {
      cp: 0,
      list: [],
      loading: true,
      finished: false,
      scrollTop: 0,
    }

    //this.onLoad()
  },


  onLoad() {
      this.doSearch(false)
    },

  mounted() {
    this.initBaseDate()
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
.select-class {
  background: #f8f8f8;
  border-radius: var(--van-border-radius-lg);

}

.div-title {
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
  font-size: 1em;
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

.goto-select-ram {
  display: inline;
  padding: 4px 6px;
  color: blue;
}
.goto-select-ram:active {
  background: rgb(0, 0, 255, .1);
}
</style>