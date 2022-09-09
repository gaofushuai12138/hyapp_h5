<template>
  <div class="home-div">
    <van-swipe
      ref="mainSwipe"
      :initial-swipe="initIndex"
      class="my-swipe"
      :loop="false"
      :show-indicators="false"
      @change="fnChangeSwipe"
    >
      <van-swipe-item class="my-swipe-item">
        <MsgCenter :tabIndex="msgTabIndex"></MsgCenter>
      </van-swipe-item>
      <van-swipe-item class="my-swipe-item">
        <MainBoard
          @gotoMsg="gotoMsg1"
          @selectOrg="showPicker = true"
        ></MainBoard>
      </van-swipe-item>
      <van-swipe-item class="my-swipe-item">
        <MeInfo @gotoMsg="gotoMsg2"></MeInfo>
      </van-swipe-item>
    </van-swipe>
    <van-tabbar v-model="actIndex">
      <van-tabbar-item @click="fnChangeTab">
        <van-image
          v-show="actIndex != 0"
          height="var(--van-tabbar-item-icon-size)"
          :src="require('@/assets/icon/info.png')"
          fit="contain"
        ></van-image>
        <van-image
          v-show="actIndex == 0"
          height="var(--van-tabbar-item-icon-size)"
          :src="require('@/assets/icon/info1.png')"
          fit="contain"
        ></van-image>
      </van-tabbar-item>
      <van-tabbar-item @click="fnChangeTab">
        <van-image
          v-show="actIndex == 1 && store_org.org_ico"
          height="calc(var(--van-tabbar-height) * 6 / 10)"
          :src="store_org.org_ico"
          fit="contain"
        ></van-image>
        <van-image
          v-show="actIndex == 1 && !store_org.org_ico"
          height="calc(var(--van-tabbar-height) * 6 / 10)"
          :src="require('@/assets/icon/all1.png')"
          fit="contain"
        ></van-image>
        <van-image
          v-show="actIndex != 1"
          height="calc(var(--van-tabbar-height) * 6 / 10)"
          :src="require('@/assets/icon/all.png')"
          fit="contain"
        ></van-image>
      </van-tabbar-item>
      <van-tabbar-item @click="fnChangeTab">
        <van-image
          v-show="actIndex != 2"
          height="var(--van-tabbar-item-icon-size)"
          :src="require('@/assets/icon/mine.png')"
          fit="contain"
        ></van-image>
        <van-image
          v-show="actIndex == 2"
          height="var(--van-tabbar-item-icon-size)"
          :src="require('@/assets/icon/mine1.png')"
          fit="contain"
        ></van-image>
      </van-tabbar-item>
    </van-tabbar>

    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="orgList"
        :columns-field-names="{ text: 'org_name' }"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
// import { ref } from 'vue';
import MsgCenter from 'components/home/MsgCenter.vue'
import MainBoard from 'components/home/MainBoard.vue'
import MeInfo from 'components/home/MeInfo.vue'
import { ParseJson } from '@/utils/StrUtil'
import { showPage as NativeShowPage } from '@/plugin/dsbridge'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    MsgCenter,
    MainBoard,
    MeInfo,
  },
  data() {
    return {
      initIndex: 1,
      actIndex: 0,

      msgTabIndex: 0,

      showPicker: false,
      orgList: [],
    }
  },

  computed: mapState(['store_org']),

  methods: {
    fnChangeTab() {
      this.$refs.mainSwipe.swipeTo(this.actIndex)
    },
    fnChangeSwipe(index) {
      this.actIndex = index
    },

    gotoMsg1() {
      this.gotoMsg('warning')
      // this.$router.push({name: "MsgDetail", params: {msgid: 1}})
    },

    gotoMsg2() {
      this.gotoMsg('task')
    },

    gotoMsg(tab) {
      this.msgTabIndex = tab

      this.actIndex = 0
      this.$refs.mainSwipe.swipeTo(this.actIndex)
    },

    onConfirm(selectedOrg) {
      this.showPicker = false
      if (selectedOrg) {
        this.$store.commit('store_org', selectedOrg)
      }
    },
    getOrgList() {},
  },

  beforeMount() {
    this.actIndex = this.initIndex
  },

  mounted() {
    console.info('home-page, mounted')

    // 企业列表
    this.orgList = this.$store.state.userinfo.org_list
    // console.log(this.orgList)

    // 接收到消息推送时，显示消息详细
    let pageInfoStr = NativeShowPage.get()
    let pageInfo = ParseJson(pageInfoStr)

    // pageInfo = {}  // 测试用
    if (pageInfo) {
      this.gotoMsg('task')
      this.$router.push({ name: 'MsgDetail', params: { msgid: 1 } })
    }
  },

  unmounted() {
    console.info('home-page, unmonted')
  },

  beforeRouteUpdate(to, from, next) {
    console.info('home beforeRouteUpdate')
  },
}
</script>

<style>
.home-div {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  background: #fafafa;
}

.home-swan-ctn {
  width: 100%;
  height: calc(100vh - 50px);
  overflow-x: hidden;
  overflow-y: auto;
}

.my-swipe {
  height: calc(100vh - 50px);
}
.my-swipe-item {
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>