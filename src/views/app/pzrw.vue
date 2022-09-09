<template>
  <div class="div-input">
    <van-nav-bar title="配种任务" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>
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
      <van-col span="6">公羊号</van-col>
      <van-col span="6">公栏舍</van-col>
      <van-col span="6">公栏舍</van-col>
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
          <van-col span="6">{{row.ewe_barn}}</van-col>
          <van-col span="6">{{row.ram_no}}</van-col>
          <van-col span="6">{{row.ram_barn}}</van-col>
          <van-col span="6">{{row.ram_barn}}</van-col>
        </van-row>
      </van-list>
    </div>

    <div class="bottom-button">
      <van-button type="primary" block round>提交</van-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

const exampleData = {
  ewe_barn: "A0101", ram_no: "G0280380", ram_barn: "A0609"
}
export default {
  name: "pzrw",
  data() {
    return {
      showPicker: false,
      buildNo: null,
      buildList: [],

      list: [],
      loading: false,
      finished: false,
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
    onClickLeft() {
      history.back()
    },

    onConfirm(item) {
      this.buildNo = item
      this.showPicker = false
    },

    clearBuild() {
      this.showPicker = false
      this.buildNo = null
    },

    async doSearch() {
      this.loading = true;

      try {
        let res = await axios.post("",  {
          act: "api_breed_missionlist",
        },{
          no_loading: true,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.list = res.data.room_list || []
      } catch(err) {
        console.info(err)
      } finally {
          this.loading = false
          this.finished = true
      }

    },
    onLoad() {
      this.doSearch()
    },

    async initBaseDate() {
      this.list = []
      this.loading = false
      this.finished = false

      this.showPicker = false
      this.buildNo = null

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

      this.doSearch(true)
    }
  },

  activated() {
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
</style>