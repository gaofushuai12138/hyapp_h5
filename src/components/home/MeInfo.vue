<template>
  <div class="home-swan-ctn">
    <div class="user-info">
      <div class="user-img">
        <van-image
          width="100"
          height="100"
          radius="10"
          fit="container"
          src=""
          class="user-avator"
        />
      </div>
      <div class="user-text">
        <div class="name">
          {{user.name}}
          <van-button type="default" text="注销登录" size="small" style="float: right;" @click="doLogout"/>
        </div>
        <div class="auth-role">
          {{user.auth_role}}
        </div>
        <div>
          <van-button type="primary" text="高级认证" size="small"/>
        </div>
      </div>
    </div>
    <van-row>
      <van-cell is-link class="cell-style" @click="gotoMsg">
        <van-image :src="require('@/assets/icon/envelope.png')" fit="contain" width="30"></van-image>
        <span>消息</span>
      </van-cell>
      <van-cell is-link class="cell-style" >
        <van-image :src="require('@/assets/icon/help.png')" fit="contain" width="30"></van-image>
        <span>帮助与反馈</span>
      </van-cell>
      <van-cell is-link class="cell-style" @click="gotoWorkGroup"> 
        <van-image :src="require('@/assets/icon/app/employee_info.png')" fit="contain" width="30"></van-image>
        <span>用户组管理</span>
      </van-cell>
      <van-cell is-link class="cell-style" @click="gotoMe">
        <van-image :src="require('@/assets/icon/setting.png')" fit="contain" width="30"></van-image>
        <span>设置</span>
      </van-cell>
    </van-row>
  </div>
</template>
<script>
import {logout} from '@/plugin/dsbridge'

export default {
  name: "HomeMeInfo",
  data() {
    return {
      user: {
        name: "管理员",
        auth_role: "天下牧业股份有限公司管理员",
        img: "",
      },
    }
  },

  methods: {
    gotoMe() {
      this.$router.push( {
        path: '/meinfo/setting'
      })
    },

    gotoMsg() {
      this.$emit("gotoMsg", {})
    },

    doLogout() {
      logout()
      // let us = dsBridge.callFn("readUserInfo")
      // alert(us)
    },
    gotoWorkGroup(){
      this.$router.push({
        path:"/app/userGroup"
        
      })
    }
  },

}
</script>
<style scoped>
.home-swan-ctn {
  text-align: left;
}
.user-info {
  position: inherit;
  /* background: #d8e4f1; */
  background: rgba(25,137,250,.1);
  padding: 10px 10px 10px 120px;
  min-height: 100px;
}
.user-img {
  position: absolute;
  top: 10px;
  left: 10px;
}

.user-info .user-text{
  text-align: left;
}

.user-text .name {
  font-size: 1.2em;
  padding-bottom: 10px;
}
.user-text .auth-role {
  font-size: 1em;
  padding-bottom: 10px;
}

.user-avator {
  background: rgba(0,0,0,0);
}

.cell-style {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 1.1em;
}

.cell-style .van-image {
  height: 1.2em;
  margin: 0 10px 0 0;
  transform: translatey(4px);
}

.cell-style:active span {
  color: #1989fa;
}
</style>