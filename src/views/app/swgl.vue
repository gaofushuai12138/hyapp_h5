<template>
  <div>
    <van-nav-bar title="饲喂管理" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-tabs v-model:active="actIndex" swipeable>
      <van-tab name="0" class="tab-contain">
        <template #title> 未发布 </template>
        <div ref="msglist0" class="tab-div" @scroll.passive="onScroll0">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s0.loading"
            :finished="listData.s0.finished"
            finished-text="没有更多了"
            @load="onLoad('s0')"
          >
            <div
              v-for="(item, index) in listData.s0.list"
              :key="index"
              class="list-row"
              @click="goToDetails(item)"
            >
              <div class="list-row-header --margin-bottom-10">
                {{ item.feed_date }}
                <span class="right">
                  {{ convertSheepTypeToSheepName(item.sheep_type) }}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{ item.formula_name }}
                  <span class="right"> {{ item.feed_weight }} kg </span>
                </div>
                <div>
                  {{ item.areas }}
                  <!-- <van-button style="width:100px" type="primary" round size="small">发布</van-button> -->
                </div>
              </div>
            </div>
          </van-list>
          <van-button
            class="conner-add-button"
            type="primary"
            round
            to="/app/swgl/add"
            ><van-icon name="plus"
          /></van-button>
        </div>
      </van-tab>
      <van-tab name="1" class="tab-contain">
        <template #title>
          <van-badge dot> 未执行 </van-badge>
        </template>
        <div class="tab-div">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s1.loading"
            :finished="listData.s1.finished"
            finished-text="没有更多了"
            @load="onLoad('s1')"
          >
            <div
              v-for="(item, index) in listData.s1.list"
              :key="index"
              class="list-row"
            >
              <div class="list-row-header --margin-bottom-10">
                {{ item.feed_date }}
                <span class="right">
                  {{ item.sheep_type }}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{ item.formula_name }}
                  <span class="right"> {{ item.feed_weight }} kg </span>
                </div>
                <div>
                  {{ item.areas }}
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab name="2" class="tab-contain">
        <template #title> 已完成 </template>
        <div class="tab-div">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s9.loading"
            :finished="listData.s9.finished"
            finished-text="没有更多了"
            @load="onLoad('s9')"
          >
            <div
              v-for="(item, index) in listData.s9.list"
              :key="index"
              class="list-row"
            >
              <div class="list-row-header --margin-bottom-10">
                {{ item.feed_date }}
                <span class="right">
                  {{ item.animal_type }}
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{ item.formula_name }}
                  <span class="right"> {{ item.feed_weight }} kg </span>
                </div>
                <div>
                  {{ item.areas }}
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
import _ from 'lodash'
import axios from 'axios'

export default {
  name: 'swgl',
  data() {
    return {
      actIndex: 0,
      listData: {},
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },
    convertSheepTypeToSheepName(type) {
      if (type == 1) {
        return '种羊'
      } else if (type == 2) {
        return ''
      } else if (type == 3) {
        return '青年母羊'
      } else if (type == 4) {
        return '育肥羊'
      } else if (type == 5) {
        return '断奶羔羊'
      } else if (type == 6) {
        return '哺乳小羊'
      }
    },
    initPage() {
      this.actIndex = 0

      this.listData = {
        s0: {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
        s1: {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
        s9: {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        },
      }
    },

    goToDetails(item) {
      console.log(item)
      this.$router.push({
        path: '/app/swgl/add',
        query: {
          feedId: item.feed_plan_id,
          areas: item.areas
        },
      })
    },
    async doSearch(type, isRefreshing) {
      let listData = this.listData[type]

      if (isRefreshing) {
        listData.finished = true
        listData.list = []
        listData.cp = 0
      }

      try {
        let res = await axios.post(
          '',
          {
            act: 'api_feed_list',
            state: type == 's0' ? 0 : type == 's1' ? 1 : 0,
            page: listData.list.length == 0 ? 0 : listData.cp,
            size: 20,
          },
          {
            no_loading: true,
          },
        )
        console.log(res)

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }

        listData.cp += 1

        let data = res.data
        for (let i = 0; i < data.feed_list.length; i++) {
          listData.list.push(data.feed_list[i])
        }

        // 加载状态结束
        listData.loading = false

        if (!data.has_more) {
          listData.finished = true
        }
      } catch (err) {
        listData.loading = false
        listData.finished = true
      }
    },

    onLoad(type) {
      let listData = this.listData[type]
      this.doSearch(type, false)
    },

    onScroll0(e) {
      this.scrollTop0 = e.srcElement.scrollTop
    },
  },

  mounted() {
    window.$hyt_swgl_init = true
  },

  activated() {
    if (this.$route.isback) {
      ;(window.$fygl_add_back === true
        ? ['s1', 's9']
        : ['s0', 's1', 's9']
      ).forEach(type => {
        if (this.listData[type].scrollTop > 0)
          this.$refs['msglist_' + type].scrollTop =
            this.listData[type].scrollTop
      })

      if (window.$fygl_add_back === true) {
        window.$fygl_add_back = false

        this.listData['s0'] = {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 0,
        }

        this.onLoad('s0')
      }
    }

    if (!this.$route.isback) {
      this.initPage()
      this.onLoad('s0')
      this.onLoad('s1')
      this.onLoad('s9')
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
  padding-right: 60px;
}

.list-row-body {
  padding-right: 60px;
}
</style>
