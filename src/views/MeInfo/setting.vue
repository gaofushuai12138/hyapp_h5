<template>
  <div class="div-input">
    <van-nav-bar title="设定" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>
    <van-tabs v-model:active="actIndex">
      <van-tab title="个人信息" name="info" class="tab-contain">
        <div class="tab-div">
          <div class="div-title div-title-padbottom8">昵称</div>    
          <van-cell-group inset>
            <van-field v-model="nikname" placeholder="请输入昵称" />
          </van-cell-group>
          <div style="padding: 20px; margin-top: 20px">
            <van-button type="primary" round block @click="onClickSubmitInfo">提交</van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="修改密码" name="pass" class="tab-contain">
        <div class="tab-div">
          <div class="div-title div-title-padbottom8">当前密码</div>    
          <van-cell-group inset>
            <van-field v-model="pass" type="password" placeholder="请输入当前密码" />
          </van-cell-group>

          <div class="div-title div-title-padbottom8">新密码</div>    
          <van-cell-group inset>
            <van-field v-model="pass1" type="password" placeholder="请输入新密码" />
          </van-cell-group>
          <van-cell-group inset style="margin-top: 10px;">
            <van-field v-model="pass2" type="password" placeholder="请确认新密码" />
          </van-cell-group>
          <div style="padding: 20px; margin-top: 20px">
            <van-button type="primary" round block @click="onClickSubmitPass">提交</van-button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Toast, Notify  } from "vant"
import _ from "lodash"
import axios from 'axios'

export default {
  name: "meinfo_setting",
  data() {
    return {
      actIndex: "info",

      nikname: "",
      pass: "",
      pass1: "",
      pass2: "",

      inloading: false,
    }
  },

  watch: {
    inloading(to, from) {
      if (to == false) {
        Toast.clear()
      }
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },

    initPage() {
      this.nikname = "dadao"

      this.inloading = false
    },
    
    async onClickSubmitInfo() {
      this.nikname = _.trim(this.nikname)

      if (this.nikname == null || this.nikname.length == 0) {
        Notify({message: "请输入昵称", type:"warning"})
        return;
      }

      this.inloading = true

      try {
        let res = await axios.post("",  {
          act: "api_user_nickname",
          name: this.nikname
        })

        if (!res || res.code != 0) {
          Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
          return
        }

        Toast.success("修改成功")
      } catch(err) {
        Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
      } finally {
        this.inloading = false
      }
    },

    async onClickSubmitPass() {

      if (this.pass == null || this.pass.length == 0) {
        Notify({message: "请输入当前密码", type:"warning"})
        return;
      }

      if (this.pass1 == null || this.pass1.length == 0 ||
          this.pass2 == null || this.pass2.length == 0) {
        Notify({message: "请输入新密码和新密码确认", type:"warning"})
        return;
      }

      if (this.pass1 != this.pass2) {
        Notify({message: "请确认两次新密码输入一致", type:"warning"})
        return;
      }

      this.inloading = true

      try {
        let res = await axios.post("",  {
          act: "api_user_changepwd",
          old: this.pass,
          new: this.pass1,
        })

        if (!res || res.code != 0) {
          Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
          return
        }

        this.pass = ""
        this.pass1 = ""
        this.pass2 = ""
        Toast.success("修改成功")
      } catch(ex) {
        Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
      } finally {
        this.inloading = false
      }
    },
  },

  activated() {
    initPage()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.inloading) {
        leave = false

        // this.inloading = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.upload-info-label {
  display: block;
  font-size: .8em;
  font-weight: 200;
  padding: 6px 0;
  color: #AAA;
}

.bottom-button .van-col {
  padding: 0 4px;
}
.bottom-button .van-button {
  width: 100%;
}
</style>