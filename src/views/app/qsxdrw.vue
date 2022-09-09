<template>
  <div>
    <van-nav-bar title="清扫消毒任务" left-arrow @click-left="onClickLeft"> </van-nav-bar>
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
            <div v-for="(item, index) in listData.s0.list" :key="index" class="list-row">
              <div class="list-row-header --margin-bottom-2" >
                {{item.clean_date}}
                <span class="right" >
                  <van-button type="primary" size="mini" style="width: 48px" @click="updateState(item.clean_id,type)" >发布</van-button>
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.type}}
                </div>
                <div>
                  {{item.areas}}
                </div>
              </div>
              <!-- <div style="height: 16px;">
                <van-icon name="arrow" style="float: right;" />
              </div> -->
            </div>
          </van-list>
          <van-button class="conner-add-button" type="primary" round to="/app/qsxdrw/add"><van-icon name="plus" /></van-button>
        </div>
      </van-tab>
      <van-tab name="s1" class="tab-contain">
        <template #title>
          <van-badge dot> 未执行 </van-badge>
        </template>
        <div class="tab-div" ref="msglist_s1" @scroll.passive="onScroll">
          <van-list
            :immediate-check="false"
            v-model:loading="listData.s1.loading"
            :finished="listData.s1.finished"
            finished-text="没有更多了"
            @load="onLoad('s1')"
          >
            <div v-for="(item, index) in listData.s1.list" :key="index" class="list-row" plan_id="{{item.plan_id}}">
              <div class="list-row-header --margin-bottom-2">
                {{item.clean_date}}
                <span class="right">
                  <van-button type="primary" size="mini" style="width: 48px" @click="updateState(item.clean_id,type)">执行</van-button>
                </span>
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.type}}
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
            v-model:loading="listData.s9.loading"
            :finished="listData.s9.finished"
            finished-text="没有更多了"
            @load="onLoad('s9')"
          >
            <div v-for="(item, index) in listData.s9.list" :key="index" class="list-row" plan_id="{{item.plan_id}}">
              <div class="list-row-header --margin-bottom-10">
                {{(item.clean_date || "").substring(0, 10)}}
              </div>
              <div class="list-row-body">
                <div class="--margin-bottom-10">
                  {{item.type}}
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
  name: "qsxdrw",
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
          scrollTop: 1,
        },
        "s9": {
          cp: 0,
          list: [],
          loading: true,
          finished: false,
          scrollTop: 2,
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
          act: "api_clean_list",
          state: type == "s0" ? 0 : type == "s1" ? 1 : 2,
          page: listData.list.length == 0 ? 0 : listData.cp,
          size: 20,
        },{
          no_loading: true,
        })

        //console.log(state)

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }

        listData.cp += 1

        let data = res.data
        //console.log(data)
        for (let i = 0; i < data.clean_list.length; i++) {          
          //判断数据表中的type类型，并转化成文字,1是清扫，2是消毒
          if(data.clean_list[i].type == "1"){
            data.clean_list[i].type = "清扫" ;
          }else if(data.clean_list[i].type == "2"){
            data.clean_list[i].type = "消毒" ;
          }else if(data.clean_list[i].type == "1,2"){
            data.clean_list[i].type = "清扫  消毒" ;
          }else if(data.clean_list[i].type == "2,1"){
            data.clean_list[i].type = "消毒  清扫" ;
          }else if(data.clean_list[i].type == "2,2"){
            data.clean_list[i].type = "消毒  消毒" ;
          }else if(data.clean_list[i].type == "1,1"){
            data.clean_list[i].type = "清扫  清扫" ;
          }
          //console.log(data.clean_list[i].type)
          //输出后台传过来的数据        
          listData.list.push(data.clean_list[i]);
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
    

    //执行更新状态接口函数
    async doUpdState(clean_id,type, isRefreshing) {
      let listData = this.listData[type]

      if (isRefreshing) {
        listData.finished = true
        listData.list = []
        listData.cp = 0
      }

      try {
        let res = await axios.post("",  {
          act: "api_clean_change",
          state: type == "s0" ? 1 : type == "s1" ? 2 : 2,
          // page: listData.list.length == 0 ? 0 : listData.cp,
          // size: 20,
          clean_id:clean_id,
        },{
          no_loading: true,
        })

        if (!res || res.code != 0 || !res.data) {
          listData.loading = false
          listData.finished = true
          return
        }

        listData.cp += 1
        
        // 加载状态结束
        listData.loading = false;
        //this.onLoad(type)

        if (!data.has_more) {
          listData.finished = true
        }
      } catch(err) {
        listData.loading = false
        listData.finished = true
      }
    },


    updateState(clean_id,type) {
      //获取页面标签，即对应数据表中的state
      type = this.actIndex
      this.doUpdState(clean_id,type, false)
    },
    
    onLoad(type) {
      
      this.doSearch(type, false)
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
      (window.$qsxdrw_add_back === true ? ["s1", "s9"] : ["s0", "s1", "s9"]).forEach((type) => {
        if (this.listData[type].scrollTop > 0) 
          this.$refs["msglist_" + type].scrollTop = this.listData[type].scrollTop
      })

      if (window.$qsxdrw_add_back === true) {
        window.$qsxdrw_add_back = false

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
  padding-right: 50px;
  height: 1.8em;
}

</style>
