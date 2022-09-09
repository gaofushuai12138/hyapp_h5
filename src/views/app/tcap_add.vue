<template>
  <div class="div-input">
    <van-nav-bar
      title="新增体测安排计划"
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
    </van-nav-bar>

    <div class="div-title div-title-padbottom8">计划日期</div>
    <van-row justify="space-between">
      <van-col span="11">
        <van-cell-group inset>
          <van-cell
            style="height: 44px"
            :value="datePlan"
            @click="showDatePlan = true"
            value-class="date-class"
          />
          <van-calendar
            v-model:show="showDatePlan"
            :show-confirm="false"
            @select="onConfirmDate"
          />
        </van-cell-group>
      </van-col>
    </van-row>

    <div class="div-title div-title-padbottom8">任务名称</div>
    <van-cell-group inset>
      <van-field v-model="taskname"> </van-field>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">关联栏舍</div>
    <van-cell-group inset>
      <van-cell style="min-height: 100px" @click="showCoopsSelect = true">
        <div v-for="(item, index) in coopsText" :key="index">
          {{ item }}
        </div>
      </van-cell>
      <van-popup v-model:show="showCoopsSelect" round position="bottom">
        <van-picker title="栏舍选择" />
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">
      羊数量<span class="right">320</span>
    </div>

    <van-row justify="space-between" style="padding: var(--van-padding-md)">
      <van-col span="12">
        <van-button type="default" class="tcap-button" @click="onClickLeft"
          >取消</van-button
        >
      </van-col>
      <van-col span="12">
        <van-button type="primary" class="tcap-button" @click="onClickSubmit"
          >提交</van-button
        >
      </van-col>
    </van-row>
  </div>
</template>
<script>
import { Toast } from 'vant'

export default {
  name: 'tcap_add',
  data() {
    return {
      showDatePlan: false,
      datePlan: null,

      taskname: 'null',

      showCoopsSelect: false,
      coops: [
        ['A011', 'A012', 'A013'],
        ['A021', 'A022'],
      ],

      inloading: false,
    }
  },

  computed: {
    coopsText() {
      return this.coops.map(row => (row ? _.join(row, ',') : ''))
    },
  },

  watch: {
    inloading(to, from) {
      if (to == false) {
        Toast.clear()
      }
    },
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    onConfirmDate(date) {
      this.showDatePlan = false
      this.datePlan = date.format('yyyy-MM-dd')
    },

    onClickSubmit() {
      this.inloading = true
      Toast.loading({
        duration: 0,
        message: '正在提交...',
        forbidClick: true,
      })

      setTimeout(() => {
        this.inloading = false
      }, 3000)
    },
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === 'popstate') {
      if (this.showCoopsSelect || this.showDatePlan || this.inloading) {
        leave = false

        this.inloading = false
        this.showDatePlan = false
        this.showCoopsSelect = false
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