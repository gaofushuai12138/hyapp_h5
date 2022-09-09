<template>
  <div class="div-input">
    <van-nav-bar :title="title_name" left-arrow fixed @click-left="onClickLeft"> </van-nav-bar>
    <div>
      <div class="monitor-screen">
        （监控画面1）
      </div>
      <div class="monitor-screen-memo">东向西</div>
      <div class="monitor-screen">
        （监控画面2）
      </div>
      <div class="monitor-screen-memo">西向东</div>

      <div class="list-row">
        <div class="list-row-body">
          <van-row justify="space-between" v-for="(itemrow, index) in ctl_data.iot0" :key="index" class="iotctl-grouprow">
            <van-col span="11" v-for="(item, index2) in itemrow" :key="index2">
              <div class="iotctl-cell">
                {{item.name}}
                <span class="iotctl-grouprow-switch">
                  <van-switch v-model="item.status" size="1.4em" 
                    inactive-color="#888" active-color="#11D716" 
                    inactive-value="off" active-value="on"
                    @change="switchCell(0, index, index2)" />
                </span>
              </div>
            </van-col>
          </van-row>
          <van-row justify="space-between" v-for="(itemrow, index) in ctl_data.iot1" :key="index" class="iotctl-grouprow">
            <van-col span="11" v-for="(item, index2) in itemrow" :key="index2">
              <div class="iotctl-cell">
                {{item.name}}
                <span class="iotctl-grouprow-switch" :style="switchStatus[item.status].style">
                  {{switchStatus[item.status].name}}
                </span>
              </div>
            </van-col>
          </van-row>
          <van-row justify="space-between" v-for="(itemrow, index) in ctl_data.iot2" :key="index" class="iotctl-grouprow">
            <van-col span="11" v-for="(item, index2) in itemrow" :key="index2">
              <div class="iotctl-cell">
                {{item.name}}
                <span class="iotctl-grouprow-switch" :style="switchStatus[item.status].style">
                  <van-switch v-model="item.status" size="1.4em" 
                    inactive-color="#888" active-color="#11D716" 
                    inactive-value="off" active-value="on"
                    @change="switchCell(2, index, index2)" />
                </span>
              </div>
            </van-col>
          </van-row>
          <van-row justify="space-between" v-for="(itemrow, index) in ctl_data.iot3" :key="index" class="iotctl-grouprow">
            <van-col span="11" v-for="(item, index2) in itemrow" :key="index2">
              <div class="iotctl-cell">
                {{item.name}}
                <span class="iotctl-grouprow-switch" :style="switchStatus[item.status].style">
                  <van-switch v-model="item.status" size="1.4em" 
                    inactive-color="#888" active-color="#11D716" 
                    inactive-value="off" active-value="on"
                    @change="switchCell(3, index, index2)" />
                </span>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {useRoute} from "vue-router"

const switchStatus = {
  off: { name: '关', },
  on: { name: '开', style: "color: green" },
  close: { name: '收', },
  stop: { name: '停', style: "color: blue" },
  open: { name: '放', style: "color: green" },
}

export default {
  data() {
    return {
      title_name: "",

      switchStatus,

      ctl_data: {
        iot0: _.chunk([{ name: "喷淋", status: 'on'}], 2),   // 0:关，1:开，2:收，3:停
        iot1: _.chunk([
          { name: "卷膜1", status: 'stop'}, { name: "卷膜2", status: 'close'}, { name: "卷膜3", status: 'open'}, { name: "卷膜4", status: 'open'},
        ], 2),
        iot2: _.chunk([
          { name: "风扇1", status: 'off'}, { name: "风扇2", status: 'on'}, { name: "风扇3", status: 'on'}, 
        ], 2),
        iot3: _.chunk([
          { name: "灯1", status: 'on'}, { name: "灯2", status: 'off'}, { name: "灯3", status: 'on'}, 
        ], 2),
      }
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    switchCell(group, row, index) {
      // console.info(group, row, index, this.ctl_data["iot"+group][row][index])
    }
  },

  mounted() {
    let {id} = useRoute().query
    this.title_name = "设备控制 " + id

    console.info(this.ctl_data)
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.inloading) {
        leave = false

        this.inloading = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.iotctl-grouprow {
  padding: 10px 0;
  font-size: 1em;
}

.iotctl-grouprow-switch {
  float: right;
}

.iotctl-cell {
  line-height: 1.6em
}

.monitor-screen {
  height: 25vh;
  background: #F6F6F6;
  color: #AAA
}

.monitor-screen-memo {
  margin: 4px 0 16px 0;
  color: #888;
  text-align: center;
  font-size: .9em;
}
</style>
