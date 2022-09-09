<template>
  <div class="home-swan-ctn">
    <!-- <div class="home-swan-ctn add-nav-bar"> -->
    <!-- <van-nav-bar title="消息" class="nav-bar-top" /> -->
    <van-tabs v-model:active="actIndex" :animated="true">
      <van-tab title="公告板" name="common" class="tab-contain">
        <template #title> <van-icon name="more-o" />公告栏 </template>
        <!--下拉刷新--> 
          <div class="tab-div" ref="msglist_common" @scroll.passive="onScroll">
            <van-list
              v-model:loading="listData.common.loading"
              :finished="listData.common.finished"
              finished-text="没有更多了"
              @load="onLoad('common')"
            >
              <div
                v-for="(item, index) in listData.common.list"
                :key="index"
                class="list-common-row"
                @click="gotoDetail(item.msg_id)"
              >
                <div class="list-common-title">
                  <div class="list-common-day">
                    <span>{{ item.msg_month }}月</span>
                    <span>{{ item.msg_day }}</span>
                  </div>
                  <p style="margin-bottom: 4px">{{ item.msg_title }}</p>
                  <small>{{ item.msg_sub_title }}</small>
                </div>
                <van-image
                  width="100%"
                  fit="container"
                  :src="item.msg_img"
                  v-if="item.msg_img"
                  class="list-common-img"
                />
                <div
                  class="list-common-content"
                  v-if="
                    item.msg_short_desc != '' && item.msg_short_desc != null
                  "
                >
                  <van-icon name="bullhorn-o" />
                  {{ item.msg_short_desc }}
                </div>
              </div>
            </van-list>
          </div>
        
      </van-tab>
      <van-tab title="异常信息" name="warning">
        <template #title> <van-icon name="warn-o" />异常信息 </template>
        <div class="tab-div" ref="msglist_warning" @scroll.passive="onScroll">
          <van-list
            v-model:loading="listData.warning.loading"
            :finished="listData.warning.finished"
            finished-text="没有更多了"
            @load="onLoad('warning')"
          >
            <div
              v-for="(item, index) in listData.warning.list"
              :key="index"
              class="list-common-row list_warn_row"
              @click="gotoDetail(item.msg_id)"
            >
              <div class="list-warn-title">
                {{ item.msg_sub_title }}
                <span>{{ item.msg_time }}</span>
              </div>
              <div class="list-common-content list-warn-content">
                {{ item.msg_title }}
                <!-- <p>{{item.msg_short_desc}}</p> -->
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="任务" name="task">
        <template #title> <van-icon name="more-o" />任务 </template>
        <div class="tab-div" ref="msglist_task" @scroll.passive="onScroll">
          <van-list
            v-model:loading="listData.task.loading"
            :finished="listData.task.finished"
            finished-text="没有更多了"
            @load="onLoad('task')"
          >
            <div
              v-for="(item, index) in listData.task.list"
              :key="index"
              class="list-common-row list_warn_row"
              @click="gotoDetail(item.msg_id)"
            >
              <div class="list-warn-title">
                <span>{{ item.msg_time }}</span>
              </div>
              <div class="list-common-content list-warn-content">
                {{ item.msg_title }}
                <p>{{ item.msg_short_desc }}</p>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <div class="search-row">
      <van-icon name="wap-nav" class="seach-menu" />
      <van-search
        v-model="listData[actIndex].searchValue"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import axios from 'axios'
import { Toast } from 'vant'

export default {
  name: 'HomeMsgCenter',

  props: ['tabIndex'],

  data() {
    return {
      actIndex: 'common',
      isLoading: false,
      listData: {
        common: {
          searchValue: '',
          cp: 0,
          list: [],
          loading: false,
          finished: false,
          scrollTop: 0,
        },
        warning: {
          searchValue: '',
          cp: 0,
          list: [],
          loading: false,
          finished: false,
          scrollTop: 0,
        },
        task: {
          searchValue: '',
          cp: 0,
          list: [],
          loading: false,
          finished: false,
          scrollTop: 0,
        },
      },
    }
  },

  watch: {
    tabIndex: {
      immediate: true,
      handler(newValue, oldValue) {
        if (!newValue) {
          return
        }
        this.actIndex = newValue
      },
    },
  },

  methods: {
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
            act: 'api_msg_list',
            tp: type == 'warning' ? 2 : type == 'task' ? 3 : 1,
            keyword: _.trim(listData.searchValue),
            page: listData.list.length == 0 ? 0 : listData.cp,
            size: 20,
          },
          {
            no_loading: true,
          },
        )
        console.log(res.data)

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }
        listData.cp += 1
        let data = res.data
        for (let i = 0; i < data.msg_list.length; i++) {
          listData.list.push(data.msg_list[i])
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
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 1000)
    },

    onLoad(type) {
      let listData = this.listData[type]
      listData.loading = true
      this.doSearch(type, false)
    },

    onSearch(val) {
      let listData = this.listData[this.actIndex]
      listData.searchValue = _.trim(listData.searchValue)
      this.doSearch(this.actIndex, true)
    },

    onCancel() {
      let listData = this.listData[this.actIndex]
      listData.searchValue = ''
      this.doSearch(this.actIndex, true)
    },

    gotoDetail(msgid) {
      // console.log(msgid)
      // console.log(this.actIndex)
      let type = this.convertTypeToNumber(this.actIndex)
      // console.info('msgid', msgid)
      this.$router.push({
        name: 'MsgDetail',
        params: { msgid: msgid, tp: type },
      })
    },
    onScroll(e) {
      this.listData[this.actIndex].scrollTop = e.srcElement.scrollTop
    },
    convertTypeToNumber(type) {
      if (type == 'common') return 1
      else if (type == 'warning') return 2
      else if (type == 'task') return 3
    },
  },
  mounted() {
    this.actIndex = 'common'
  },

  activated() {
    if (this.$route.isback) {
      ;['common', 'warning', 'task'].forEach(type => {
        if (this.listData[type].scrollTop > 0)
          this.$refs['msglist_' + type].scrollTop =
            this.listData[type].scrollTop
      })
    }
  },
}
</script>
<style scoped>
.nav-bar-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.tab-contain {
  width: 100%;
  /* height: calc(100vh - 46px - 44px - 50px); */
  height: calc(100vh - 44px - 50px);
  overflow-x: hidden;
  overflow-y: auto;
}

.search-row {
  position: absolute;
  /* top: 90px; */
  top: 44px;
  right: 0;
  left: 0;

  box-sizing: border-box;
  padding-left: 35px;

  background: #fff;
  border-bottom: 1px solid #eee;
}

.search-row i.seach-menu {
  position: absolute;
  left: 10px;
  top: 15px;
  font-size: 25px;
  color: #1989fa;
}

.tab-div {
  /* height: calc(100vh - 54px - 46px - 44px - 50px); */
  height: calc(100vh - 54px - 44px - 50px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 54px;
  box-sizing: border-box;
}

.list_warn_row {
  background: #fff;
  margin-top: 10px;
  margin-bottom: 0;
  border: 0;
  padding: 0;
}
.list-warn-title {
  position: relative;
  text-align: left;
  padding: 6px 10px;
  border-bottom: 1px solid #eee;
  color: #888;
  min-height: 22px;
}
.list-warn-title span {
  float: right;
  padding-top: 4px;
}
.list-warn-content {
  padding: 10px;
  word-break: break-all;
  word-wrap: break-word;
  margin-top: 0;
}
</style>