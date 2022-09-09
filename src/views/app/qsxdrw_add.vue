<template>
  <div class="div-input">
    <van-nav-bar title="新增清扫消毒任务" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>

    <div class="div-title div-title-padbottom8">计划日期</div>
    <van-cell-group inset>
      <van-cell style="height: 44px;" :value="date" @click="showDate = true" value-class="date-class" />
      <van-calendar v-model:show="showDate" :show-confirm="false" @select="onConfirmDate"  color="var(--van-blue)"/>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">任务内容</div>    

    <van-field style="background:#FFF">
      <template #input>
        <van-checkbox-group v-model="taskList" @click="onConfirm" direction="horizontal">
          <van-checkbox name="1" shape="square" >清扫</van-checkbox>
          <van-checkbox name="2" shape="square" >消毒</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>

    <div class="div-title div-title-padbottom8">关联栏舍</div>
    <van-cell-group inset>
      <van-cell
        style="min-height: 100px;"
        @click="showHutchsSelect = true" >
        <div v-for="(item, index) in hutchsText" :key="index">
          {{item}}
        </div>
      
      </van-cell>
      <van-popup v-model:show="showHutchsSelect" round position="bottom" closeable close-icon="close">
        <div style="padding: 15px 0;">
          栏舍选择
        </div>
        <van-tree-select
          v-model:show="showHutchsSelect"
          v-model:active-id="hutchActiveId"
          v-model:main-active-index="hutchMainActiveIndex"
          :items="hutchsArea"
          @click-item="onConfirmCoops"
        ></van-tree-select>
      </van-popup>

    </van-cell-group>

    

    <van-row justify="space-between" style="padding: var(--van-padding-md);">
      <van-col span="12">
        <van-button type="default" class="tcap-button" @click="onClickLeft">取消</van-button>
      </van-col >
      <van-col span="12">
        <van-button type="primary" class="tcap-button" @click="onClickSubmit">提交</van-button>
      </van-col >
    </van-row>
  </div>
</template>
<script>
import { Toast, Notify } from "vant"
import _ from "lodash"
import axios from 'axios'

const changeHutchFormat = (data_list) => {
  console.log("data"+data_list)
  return data_list.map((data) => {
    return {
      "id": data.room.r_id,
      "text": data.room.r_name,
      "children": data.hutchsList.map((hutch) => {
        return {
          room_id: data.room.r_id,
          text: hutch.h_name, id: hutch.h_id,
          r_num: hutch.r_num
        }
      })
    }
  })
}

export default {
  name: "qsxdrw_add",
  data() {
    return {
      //清扫任务列表
      taskList:[],

      clean_id: null,
      showDate: false,
      date: null,



      showcleancPicker: false,
      option_cleanc: [],
      cleanc: null,

      showHutchsSelect: false,
      hutchsArea: [],
      // hutchActiveId: ['A010', 'C011'],
      hutchActiveId: [],
      hutchMainActiveIndex: 0,
      hutchs: [],

      inloading: false,
    }
  },

  computed: {
    // showTaskList(){
    //   console.log(this.taskList)
    // },
    // cleancText() {
    //   return this.cleanc ? this.cleanc.cleanc_name : "请选择疫苗..."
    // },
    cleancValue() {
      //给cleanc赋值并将其转化成字符串格式
      return this.cleanc ? this.taskList.join(",") : null
    },

    cleancTextClass() {
      let s = {
        "text-align": "left"
      }

      if (this.cleancValue == null || this.cleancValue == undefined) {
        s["color"] = "#aaa"
      }
      return s
    },

    hutchsText() {
      let hutchs = this.hutchsArea
                    .filter(area => area && !!area.badge && area.children)
                    .map((ca) => {
                      return ca.children.filter(ch => this.hutchs.findIndex(c => c.id == ch.id) >= 0)
                                        .map(ch => ch.text)
                    })

      return hutchs.map(row => row ? _.join(row, ",") : "")
    },

    sheep_count() {
      let cnt = 0
      this.hutchs.map((h) => {
        let num = Number(h.r_num)
        cnt += isNaN(num) ? 0 : num
      })

      return cnt
    },

  },

  methods: {
    onClickLeft() {
      window.$qsxdrw_add_back = true
      history.back()
    },

    checkDateRange(from, to) {
      if (from && to && from > to) {
        Toast('清扫消毒计划日期范围不正确')
        return false
      }

      return true
    },

    onConfirmDate(date) {
      this.showDate = false
      this.date = date.format('yyyy-MM-dd')
    },

    async onClickSubmit() {

      if (!this.date || !this.cleancValue || this.hutchs.length == 0) {
        Notify({message: "请将清扫消毒信息填写完整", type:"warning"})
        return;
      }


      let param = {
        act: "api_clean_update",   
        clean_id: 0,
        clean_date: this.date,
        type: this.cleancValue,
        // plan_date_f: this.dateFrom,
        // plan_date_t: this.dateTo,
        //clean_id: this.cleancValue,
        rooms: _.uniq(this.hutchs.map(h => h.room_id)).map((room_id) => { 
                return {
                  room_id,
                  hutchs: this.hutchs
                                .filter(h => h.room_id == room_id)
                                .map((h) => {
                                  return {
                                    hutch_id: h.id}
                                })
                }
              })
      }

      this.inloading = true
      try {
        let res = await axios.post("",  param)

        if (!res || res.code != 0) {
          Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
          return
        }

        window.$fygl_add_back = true
        history.back()
      } catch(ex) {
        Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
      } finally {
        this.inloading = false
      }
    },
    
    onConfirm(item) {
      //获取复选框中的name值
      this.cleanc = item
      this.showcleancPicker = false
    },

    clearcleanc() {
      this.showcleancPicker = false
      this.cleanc = null
    },

    drawRooms() {
      this.hutchActiveId = this.hutchs.map(c => c.id)
      this.hutchsArea.forEach((ca) => {
        let selNode = (ca.children || [])
                        .filter(ch => this.hutchs
                                            .findIndex(c => ch && c.id == ch.id) >= 0)
        if (selNode.length > 0) {
          ca.badge = selNode.length
        } else {
          delete ca.badge
        }
        
      })
    },

    onConfirmCoops(selNode) {
      let index = this.hutchs.findIndex(c => c.id == selNode.id)
      if (index < 0) {
        this.hutchs.push(selNode)
      } else {
        this.hutchs.splice(index, 1)
      }

      console.info(this.hutchs)

      this.drawRooms()
    },

    async initBaseDate() {
      try {
        let res = await axios.post("",  {
          act: "api_user_vanc",
          org_id: this.$store.state.store_org.org_id,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.option_cleanc = res.data.cleanc_list
      } catch(ex) {

      }


      try {
        let res = await axios.post("",  {
          act: "api_user_choosegroup",
          org_id: this.$store.state.store_org.org_id,
        })
        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.hutchsArea = changeHutchFormat(res.data.room_list)
        
      } catch(ex) {

      }

      if (this.clean_id) {
        try {
          let res = await axios.post("",  {
            act: "api_clean_detail",
            clean_id: this.clean_id,
          })

          if (!res || res.code != 0 || !res.data) {
            return
          }

          let data = res.data

          this.date = data.clean_date     

          //let cleancs = this.option_cleanc.find(v = v.id == data.clean_id)
          this.cleanc = cleancs[0]


        } catch(ex) {

        }
      }

    }
  },

  mounted() {
    this.clean_id = this.$route.params.clean_id
    this.initBaseDate()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.inloading) {
        leave = false
      } else if (this.showVaccinePicker || this.showHutchsSelect || 
          this.showDateFrom || this.showDateTo) {
        leave = false

        this.inloading = false
        this.showDateFrom = false
        this.showDateTo = false
        this.showVaccinePicker = false
        this.showHutchsSelect = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.tcap-button {
  width: 30vw;
}
</style>