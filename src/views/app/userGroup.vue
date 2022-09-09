<template>
  <div>
    <van-nav-bar title="用户组管理" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <div class="tab-div" ref="msglist_s0" @scroll.passive="onScroll">
      <van-list
        :immediate-check="false"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad('s0')"
      >
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="list-row"
          @click="gotoDetail(item.vanc_plan_id)"
        >
          <div class="list-row-header --margin-bottom-10">
            {{ (item.plan_date_f || '').substring(0, 10) }} ~
            {{ (item.plan_date_t || '').substring(0, 10) }}
            <span class="right">
              {{ item.finished_cnt }}/{{ item.total_cnt }}
            </span>
          </div>
          <div class="list-row-body">
            <div class="--margin-bottom-10">
              {{ item.vanc_name }}
            </div>
            <div>
              {{ item.areas }}
            </div>
          </div>
          <div style="height: 16px">
            <van-icon name="arrow" style="float: right" />
          </div>
        </div>
      </van-list>
      <van-button
        class="conner-add-button"
        type="primary"
        round
        to="/app/userGroupAdd"
        ><van-icon name="plus"
      /></van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list:[],
      loading:false,
      finished:false

    }
  },
  methods: {
    onClickLeft() {
      history.back()
    },
  },
}
</script>

<style scoped>
</style>