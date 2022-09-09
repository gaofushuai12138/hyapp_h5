<template>
  <div>
    <van-nav-bar title="防疫管理" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="s0" class="tab-contain">
        <template #title> 未发布 </template>
        <div class="tab-div" ref="msglist_s0" @scroll.passive="onScroll">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s0.loading"
            :finished="listData.s0.finished"
            finished-text="没有更多了"
            @load="onLoad('s0')"
          >
            <div v-for="(item, index) in listData.s0.list" :key="index" class="list-row" @click="gotoDetail(item.vanc_plan_id)">
              <div class="list-row-header --margin-bottom-10">
                {{(item.plan_date_f || "").substring(0, 10)}} ~ {{(item.plan_date_t || "").substring(0, 10)}}
                <span class="right">
                  {{item.finished_cnt}}/{{item.total_cnt}}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.vanc_name}}
                </div>
                <div>
                  {{item.areas}}
                </div>
              </div>
              <div style="height: 16px;">
                <van-icon name="arrow" style="float: right;" />
              </div>
            </div>
          </van-list>
          <van-button class="conner-add-button" type="primary" round to="/app/fygl/add"><van-icon name="plus" /></van-button>
        </div>
      </van-tab>
      <van-tab name="s1" class="tab-contain">
        <template #title>
          <van-badge dot> 未执行 </van-badge>
        </template>
        <div class="tab-div" ref="msglist_s1" @scroll.passive="onScroll">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s0.loading"
            :finished="listData.s0.finished"
            finished-text="没有更多了"
            @load="onLoad('s1')"
          >
            <div v-for="(item, index) in listData.s0.list" :key="index" class="list-row" plan_id="{{item.plan_id}}">
              <div class="list-row-header --margin-bottom-10">
                {{(item.plan_date_f || "").substring(0, 10)}} ~ {{(item.plan_date_t || "").substring(0, 10)}}
                <span class="right">
                  {{item.finished_cnt}}/{{item.total_cnt}}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.vanc_name}}
                </div>
                <div>
                  {{item.areas}}
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab name="s9" class="tab-contain">
        <template #title> 已完成 </template>
        <div class="tab-div" ref="msglist_s9" @scroll.passive="onScroll">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s0.loading"
            :finished="listData.s0.finished"
            finished-text="没有更多了"
            @load="onLoad('s9')"
          >
            <div v-for="(item, index) in listData.s0.list" :key="index" class="list-row" plan_id="{{item.plan_id}}">
              <div class="list-row-header --margin-bottom-10">
                {{(item.plan_date_f || "").substring(0, 10)}} ~ {{(item.plan_date_t || "").substring(0, 10)}}
                <span class="right">
                  {{item.finished_cnt}}/{{item.total_cnt}}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.vanc_name}}
                </div>
                <div>
                  {{item.areas}}
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "fygl",
  data() {
    return {
      actIndex: "s0",

      listData: {}
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    initPage() {
      this.actIndex = "s0"

      this.listData = {
        "s0": {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
        "s1": {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
        "s9": {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
      }
    },

    async doSearch(type, isRefreshing) {
      let listData = this.listData[type]

      if (isRefreshing) {
        listData.finished = true
        listData.list = []
        listData.cp = 0
      }

      try {
        let res = await axios.post("",  {
          act: "api_vanc_list",
          state: type == "s0" ? 0 : type == "s1" ? 1 : 9,
          page: listData.list.length == 0 ? 0 : listData.cp,
          size: 20,
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
        for (let i = 0; i < data.vanc_list.length; i++) {
          listData.list.push(data.vanc_list[i]);
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
    
    onLoad(type) {
      this.doSearch(type, false)
    },

    gotoDetail(plan_id) {
      this.$router.push({name: "fygl_add", params: {plan_id}})
    },

    onScroll(e) {
      let listData = this.listData[this.actIndex]
      listData.scrollTop = e.srcElement.scrollTop
    }
  },

  mounted() {
  },

  activated() {
    if (this.$route.isback) {
      (window.$fygl_add_back === true ? ["s1", "s9"] : ["s0", "s1", "s9"]).forEach((type) => {
        if (this.listData[type].scrollTop > 0) 
          this.$refs["msglist_" + type].scrollTop = this.listData[type].scrollTop
      })

      if (window.$fygl_add_back === true) {
        window.$fygl_add_back = false

        this.listData["s0"] = {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        }

        this.onLoad("s0")
      }
    }

    if (!this.$route.isback) {
      this.initPage()
      this.onLoad("s0")
      this.onLoad("s1")
      this.onLoad("s9")
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
