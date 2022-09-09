<template>
  <div class="div-input">
    <van-nav-bar title="异常上报" left-arrow @click-left="onClickLeft" fixed> </van-nav-bar>

    <div class="div-title div-title-padbottom8">异常类型</div>    
    <van-cell-group inset>
      <van-cell :title="abnormalText" is-link arrow-direction="down" @click="showAbnormalPicker = true" :title-style="abnormalTexgClass">
      </van-cell>
      <van-popup v-model:show="showAbnormalPicker" position="bottom">
        <van-picker
          title="异常类型"
          :columns="option_waring"
          :columns-field-names="{ text: 'code_name', value: 'code'}"
          @confirm="onConfirm"
          @cancel="clearAbnormal"
          cancel-button-text="清空"
        />
      </van-popup>
    </van-cell-group>

    

    <div class="div-title div-title-padbottom8">异常情况</div>
    <van-cell-group inset>
      <van-field
        v-model="abnormalInfoText"
        rows="3"
        autosize
        type="textarea"
        maxlength="500"
        placeholder="请输入异常情况"
        show-word-limit
      />
    </van-cell-group>

    <div class="div-title div-title-padbottom2">
      上传附件
      <span class="upload-info-label">仅支持图片</span>
    </div>
    <van-cell-group>
      <van-field class="upload-cell">
        <template #input>
          <van-uploader v-model="filelist" :max-count="10" accept="image/png, image/jpeg, image/gif, image/bmp"
            :after-read="afterRead" 
            :before-delete="beforeDeleteFile"/>
        </template>
      </van-field>
    </van-cell-group>

    <van-row justify="space-between" style="padding: var(--van-padding-md);">
      <van-col span="12">
        <van-button type="default" class="ycsb-button" @click="onClickLeft">取消</van-button>
      </van-col >
      <van-col span="12">
        <van-button type="primary" class="ycsb-button" @click="onClickSubmit">提交</van-button>
      </van-col >
    </van-row>
  </div>
</template>
<script>
import { Toast, Notify } from "vant"
import * as imgConversion from 'image-conversion'
import axios from 'axios'


const MAX_FILE_SIZE = 100

export default {
  name:"ycsb",
  data() {
    return {
      showAbnormalPicker: false,
      option_waring: [],
      waring: null,
      abnormalInfoText: "",
      filelist: [],
      inloading: false,
      showWaringPicker: false,
    }
  },

  computed: {
    abnormalText() {
      return this.waring ? this.waring.code_name : "请选择异常类型"
    },
    abnormalValue() {
      return this.waring ? this.waring.code : null
    },

    abnormalTexgClass() {
      let s = {
        "text-align": "left"
      }

      if (this.abnormalValue == null || this.abnormalValue == undefined) {
        s["color"] = "#aaa"
      }

      return s
    },
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

    // initPage() {
    //   this.showAbnormalPicker = false
    //   // this.option_waring = [
    //   //   { value: "4", text: "园区安全", },
    //   //   { value: "5", text: "园区环卫", },
    //   //   { value: "6", text: "设施报修", },
    //   //   { value: "7", text: "羊只情况", },
    //   // ]
    //   this.waring = null,

    //   this.abnormalInfoText = ""

    //   this.filelist = []

    //   this.inloading = false
    // },

    onConfirm(item) {
      this.waring = item
      this.showAbnormalPicker = false
    },

    clearAbnormal() {
      this.showAbnormalPicker = false
      this.waring = null
    },

    // // upload 相关函数
    // onOversize(file) {
    //   console.log(file);
    //   Toast('文件大小不能超过 500kb');
    // },

    beforeDeleteFile(file) {
      return confirm("您确定要删除这个文件吗？")
    },

    async afterRead(uploader) {
      let file = uploader.file
      uploader.status = 'uploading'
      uploader.message = '上传中...'

      console.info("src file", file)

      Toast.loading({
        duration: 0,
        message: "请稍等..."
      })
      
      try {
        // 压缩
        let blob = null
        if(file.size > MAX_FILE_SIZE * 1024) {
          blob = await imgConversion.compressAccurately(file, MAX_FILE_SIZE)
          console.info(blob)
        }

        // 上传
        let formData = new FormData()
        formData.append("act", "api_msg_uploadimg")
        formData.append("file", blob || uploader.file)

        let res = await axios.post("", formData, {
          no_loading: true
        })

        if (!res || res.code != 0 || !res.data.file_name) {
          uploader.status = 'failed'
          uploader.message = '上传失败'
          return
        }

        //经过处理的上传图片的路径，
        uploader.file.$svr_url = res.data.file_name      

        uploader.status = 'done'
        uploader.message = ''

        setTimeout(() => {
          console.info(this.filelist)
        },1000)
      } catch(ex) {
        uploader.status = 'failed'
        uploader.message = '上传失败'
      } finally {
        Toast.clear()
      }
    },

    doUpload(uploader, blob) {


      try {
        
      } catch(err) {
        Toast.clear()

        uploader.status = 'failed'
        uploader.message = '上传失败'
      }

      // setTimeout(() => {
      //   // uploader.status = 'failed'
      //   // uploader.message = '上传失败'
      //   uploader.status = 'done'
      //   uploader.message = ''
      //   Toast('上传成功');
        
      // }, 1000)
    },

    async onClickSubmit() {

      if (!this.abnormalValue || !this.abnormalInfoText ||this.filelist.length == 0) {
        Notify({message: "请将异常上报信息填写完整", type:"warning"});
        return;
      }

      let param = {
        act: "api_waring_report",
        //将filelist图片路径数组转化成json格式，这样数据库才能存储
        files: JSON.stringify(this.filelist.map(f => f.file.$svr_url)),
        type_id: this.abnormalValue,
        type_name: this.abnormalText,
        note: this.abnormalInfoText,
      }

      this.inloading = true
      //
      try {
        let res = await axios.post("",  param)

        if (!res || res.code != 0) {
          Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
          return
        }

        //window.$fygl_add_back = true
        history.back()
      } catch(ex) {
        Notify({message: res && res.msg ? res.msg : "提交失败", type:"warning"})
      } finally {
        this.inloading = false
      }


      Toast.loading({
        duration: 0,
        message: '正在提交...',
        forbidClick: true,
      });

      setTimeout(() => {
        this.inloading = false
      }, 3000)
    },

    onConfirm(item) {
      //获取复选框中的name值
      this.waring = item
      this.showWaringPicker = false
    },

    clearcleanc() {
      this.showWaringPicker = false
      this.waring = null
    },


    async initBaseDate() {
      try {
        let res = await axios.post("",  {
          act: "api_user_waring",
          org_id: this.$store.state.store_org.org_id,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        this.option_waring = res.data.waring_list
        let warings = this.option_waring.find(v = v.id == data.code)
        this.waring = warings[0]        
      } catch(ex) {

      }


      // if (this.plan_id) {
      //   try {
      //     let res = await axios.post("",  {
      //       act: "api_vanc_detail",
      //       vanc_plan_id: this.plan_id,
      //     })

      //     if (!res || res.code != 0 || !res.data) {
      //       return
      //     }

      //     let data = res.data

      //     this.dateFrom = data.plan_date_f
      //     this.dateTo = data.plan_date_t

      //     let warings = this.option_waring.find(v = v.id == data.vanc_id)
      //     this.waring = warings[0]


      //   } catch(ex) {

      //   }
      // }

    }
  },

  mounted() {
    this.initBaseDate()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === "popstate") {
      if (this.showAbnormalPicker || this.inloading) {
        leave = false

        this.inloading = false
        this.showAbnormalPicker = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.upload-info-label {
  float: right;
  transform: translateY(-4px);
  font-size: .8em;
  font-weight: 200;
  padding: 6px 0;
  color: #AAA;
}

.ycsb-button {
  width: 30vw;
}
</style>