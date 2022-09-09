<template>
  <div>
    <van-nav-bar title="体测安排" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 未发布 </template>
        <div ref="msglist0" class="tab-div" @scroll.passive="onScroll0">
          <van-list
            v-model:loading="loading0"
            :finished="finished0"
            finished-text="没有更多了"
            @load="onLoad0"
          >
            <div v-for="(item, index) in list0" :key="index" class="list-row">
              <div class="list-row-header --margin-bottom-10">
                {{item.datetime}}
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.name}}
                  <span class="right">
                  {{item.complete_num}}/{{item.all_num}}
                </span>
                </div>
                <div>
                  {{item.position}}
                </div>
              </div>
            </div>
          </van-list>
          <van-button class="conner-add-button" type="primary" round to="/app/tcap/add"><van-icon name="plus" /></van-button>
        </div>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title>
          <van-badge dot> 未执行 </van-badge>
        </template>
        <div class="tab-div">
未执行
        </div>
      </van-tab>
      <van-tab name="2" class="tab-contain">
        <template #title> 已完成 </template>
        <div class="tab-div">
已完成
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
export default {
  name: "tcap",
  data() {
    return {
      actIndex: 0,

      list0: [],
      loading0: false,
      finished0: false,
      scrollTop0: 0,

      list1: [],
      loading1: false,
      finished1: false,

      list2: [],
      loading2: false,
      finished2: false,
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    initPage() {
      this.actIndex = 0

      this.list0 = []
      this.loading0 = false
      this.finished0 = false
      this.scrollTop0 = 0

      this.list1 = []
      this.loading1 = false
      this.finished1 = false

      this.list2 = [],
      this.loading2 = false
      this.finished2 = false
    },
    
    onLoad0() {
      this.loading0 = true
      setTimeout(() => {
        for (let i=0; i<10; i++) {
          this.list0.push({
            datetime: new Date().format("yyyy-MM-dd hh:mm"),
            complete_num: _.random(100, 240),
            all_num: 240,
            name: "2月龄体测",
            position: "A01 B02 B03 C04 D05",
          })
        }

        // 加载状态结束
        this.loading0 = false

        // 数据全部加载完成
        if (this.list0.length >= 40) {
          this.finished0 = true;
        }
      }, 1000)
    },

    onScroll0(e) {
      this.scrollTop0 = e.srcElement.scrollTop
    }
  },

  activated() {
    if (this.$route.isback && this.scrollTop0 > 0) {
      this.$refs.msglist0.scrollTop = this.scrollTop0
    }

    if (!this.$route.isback) {
      this.initPage()
      this.onLoad0()
    }
  },

  beforeRouteLeave(to, form, next) {
    next(true)
  },
}
</script>
<style scoped>
.tab-div {
  height: calc(100vh - 44px - 46px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  border-top: 1px solid #eee;
}

.list-row-header {
  padding-right: 65px;
}
</style>
