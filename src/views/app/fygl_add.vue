<template>
  <div class="div-input" style="padding-bottom: 70px">
    <van-nav-bar
      title="新增防疫计划"
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
    </van-nav-bar>

    <div class="div-title div-title-padbottom8">疫苗计划</div>
    <van-row justify="space-between">
      <van-col span="11">
        <van-cell-group inset>
          <van-cell
            style="height: 44px"
            :value="dateFrom"
            @click="showDateFrom = true"
            value-class="date-class"
          />
          <van-calendar
            v-model:show="showDateFrom"
            :show-confirm="false"
            @select="onConfirmFrom"
            title="疫苗计划开始日期"
            color="var(--van-blue)"
          />
        </van-cell-group>
      </van-col>
      <van-col span="2" style="line-height: 44px">
        <span>至</span>
      </van-col>
      <van-col span="11">
        <van-cell-group inset>
          <van-cell
            style="height: 44px"
            :value="dateTo"
            @click="showDateTo = true"
            value-class="date-class"
          />
          <van-calendar
            v-model:show="showDateTo"
            :show-confirm="false"
            @select="onConfirmTo"
            title="疫苗计划结束日期"
            color="var(--van-blue)"
          />
        </van-cell-group>
      </van-col>
    </van-row>

    <div class="div-title div-title-padbottom8">疫苗名</div>
    <van-cell-group inset>
      <van-cell
        :title="vanccText"
        is-link
        arrow-direction="down"
        @click="showVanccPicker = true"
        :title-style="vanccTextClass"
      >
      </van-cell>
      <van-popup v-model:show="showVanccPicker" position="bottom">
        <van-picker
          title="疫苗名"
          :columns="option_vancc"
          :columns-field-names="{ text: 'vancc_name', value: 'id' }"
          @confirm="onConfirm"
          @cancel="clearVancc"
          cancel-button-text="清空"
        />
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">关联栏舍</div>
    <van-cell-group inset>
      <van-cell style="min-height: 100px" @click="showHutchsSelect = true">
        <div v-for="(item, index) in hutchsText" :key="index">
          {{ item }}
        </div>
      </van-cell>
      <van-popup
        v-model:show="showHutchsSelect"
        round
        position="bottom"
        closeable
        close-icon="close"
      >
        <div style="padding: 15px 0">栏舍选择</div>
        <van-tree-select
          v-model:show="showHutchsSelect"
          v-model:active-id="hutchActiveId"
          v-model:main-active-index="hutchMainActiveIndex"
          :items="hutchsArea"
          @click-item="onConfirmCoops"
        ></van-tree-select>
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">
      羊数量<span class="right">{{ sheep_count }}</span>
    </div>

    <van-row
      style="
        padding: var(--van-padding-md);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      "
    >
      <van-col span="24">
        <van-button type="primary" block round @click="onClickSubmit"
          >提交</van-button
        >
      </van-col>
    </van-row>
  </div>
</template>
<script>
import { Toast, Notify } from 'vant'
import _ from 'lodash'
import axios from 'axios'

const changeHutchFormat = data_list => {
  return data_list.map(data => {
    return {
      id: data.room.r_id,
      text: data.room.r_name,
      children: data.hutchsList.map(hutch => {
        return {
          room_id: data.room.r_id,
          text: hutch.h_name,
          id: hutch.h_id,
          r_num: hutch.r_num,
        }
      }),
    }
  })
}

export default {
  name: 'fygl_add',
  data() {
    return {
      plan_id: null,
      showDateFrom: false,
      dateFrom: null,
      showDateTo: false,
      dateTo: null,

      showVanccPicker: false,
      option_vancc: [],
      vancc: null,

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
    vanccText() {
      return this.vancc ? this.vancc.vancc_name : '请选择疫苗...'
    },
    vanccValue() {
      return this.vancc ? this.vancc.id : null
    },

    vanccTextClass() {
      let s = {
        'text-align': 'left',
      }

      if (this.vanccValue == null || this.vanccValue == undefined) {
        s['color'] = '#aaa'
      }
      return s
    },

    hutchsText() {
      let hutchs = this.hutchsArea
        .filter(area => area && !!area.badge && area.children)
        .map(ca => {
          return ca.children
            .filter(ch => this.hutchs.findIndex(c => c.id == ch.id) >= 0)
            .map(ch => ch.text)
        })

      return hutchs.map(row => (row ? _.join(row, ',') : ''))
    },

    sheep_count() {
      let cnt = 0
      this.hutchs.map(h => {
        let num = Number(h.r_num)
        cnt += isNaN(num) ? 0 : num
      })

      return cnt
    },
  },

  methods: {
    onClickLeft() {
      window.$fygl_add_back = true
      history.back()
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

    async onClickSubmit() {
      if (
        !this.dateFrom ||
        !this.dateTo ||
        !this.vanccValue ||
        this.hutchs.length == 0
      ) {
        Notify({ message: '请将防疫信息填写完整', type: 'warning' })
        return
      }

      if (this.dateFrom > this.dateTo) {
        Notify({ message: '请正确输入防疫日期', type: 'warning' })
        return
      }

      let param = {
        act: 'api_vanc_update',
        total_cnt: this.sheep_count,
        plan_id: 0,
        plan_date_f: this.dateFrom,
        plan_date_t: this.dateTo,
        vanc_id: this.vanccValue,
        rooms: _.uniq(this.hutchs.map(h => h.room_id)).map(room_id => {
          return {
            room_id,
            hutchs: this.hutchs
              .filter(h => h.room_id == room_id)
              .map(h => {
                return {
                  hutch_id: h.id,
                }
              }),
          }
        }),
      }

      this.inloading = true
      try {
        let res = await axios.post('', param)

        if (!res || res.code != 0) {
          Notify({
            message: res && res.msg ? res.msg : '提交失败',
            type: 'warning',
          })
          return
        }

        window.$fygl_add_back = true
        history.back()
      } catch (ex) {
        Notify({
          message: res && res.msg ? res.msg : '提交失败',
          type: 'warning',
        })
      } finally {
        this.inloading = false
      }
    },

    onConfirm(item) {
      this.vancc = item
      this.showVanccPicker = false
    },

    clearVancc() {
      this.showVanccPicker = false
      this.vancc = null
    },

    drawRooms() {
      this.hutchActiveId = this.hutchs.map(c => c.id)
      this.hutchsArea.forEach(ca => {
        let selNode = (ca.children || []).filter(
          ch => this.hutchs.findIndex(c => ch && c.id == ch.id) >= 0,
        )
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
        let res = await axios.post('', {
          act: 'api_user_vanc',
          org_id: this.$store.state.store_org.org_id,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.option_vancc = res.data.vancc_list
      } catch (ex) {}

      try {
        let res = await axios.post('', {
          act: 'api_user_choosegroup',
          org_id: this.$store.state.store_org.org_id,
        })
        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.hutchsArea = changeHutchFormat(res.data.room_list)
      } catch (ex) {}

      if (this.plan_id) {
        try {
          let res = await axios.post('', {
            act: 'api_vanc_detail',
            vanc_plan_id: this.plan_id,
          })

          if (!res || res.code != 0 || !res.data) {
            return
          }

          let data = res.data

          this.dateFrom = data.plan_date_f
          this.dateTo = data.plan_date_t

          let vanccs = this.option_vancc.find((v = v.id == data.vanc_id))
          this.vancc = vanccs[0]
        } catch (ex) {}
      }
    },
  },

  mounted() {
    this.plan_id = this.$route.params.plan_id
    this.initBaseDate()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === 'popstate') {
      if (this.inloading) {
        leave = false
      } else if (
        this.showVaccinePicker ||
        this.showHutchsSelect ||
        this.showDateFrom ||
        this.showDateTo
      ) {
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
.ycsb-button {
  width: 30vw;
}
</style>