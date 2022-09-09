<template>
  <div>
    <van-nav-bar title="消息" fixed left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <div class="list-common-row" style="padding-top: 50px" v-if="msg.msg_id">
      <div class="list-common-title">
        <div class="list-common-day">
          <span>{{ msg.msg_month }}月</span>
          <span>{{ msg.msg_day }}</span>
        </div>
        <p style="padding-top: 8px">{{ msg.msg_title }}</p>
        <small>{{ msg.msg_sub_title }}</small>
      </div>
      <van-image
        width="100%"
        fit="container"
        :src="msg.msg_img"
        v-if="msg.msg_img"
        class="list-common-img"
      />
      <div
        class="list-common-content"
        v-if="msg.msg_content != '' && msg.msg_content != null"
      >
        <van-icon name="bullhorn-o" />
        {{ msg.msg_content }}
      </div>
    </div>
    <div v-if="tp == 2">
      <div class="div-title div-title-padbottom8">处理结果</div>
      <van-cell-group inset>
        <van-field
          v-model="solveInfoText"
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
            <van-uploader
              v-model="filelist"
              :max-count="10"
              accept="image/png, image/jpeg, image/gif, image/bmp"
              :after-read="afterRead"
              :before-delete="beforeDeleteFile"
            />
          </template>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { Toast } from 'vant'
import * as imgConversion from 'image-conversion';
const MAX_FILE_SIZE = 100
export default {
  name: 'MsgDetail',
  data() {
    return {
      solveInfoText: '',
      msgid: 2,
      tp: null,
      msg: {},
      filelist: [],
    }
  },

  methods: {
    onClickLeft() {
      history.back()
    },
    beforeDeleteFile(file) {
      return confirm('您确定要删除这个文件吗？')
    },
    async afterRead(uploader) {
      let file = uploader.file
      uploader.status = 'uploading'
      uploader.message = '上传中...'
      // console.log('src file', file)
      Toast.loading({
        duration: 0,
        message: '请稍等...',
      })
      try {
        //压缩
        let blob = null
        if (file.size > MAX_FILE_SIZE * 1024) {
          blob = await imgConversion.compressAccurately(file, MAX_FILE_SIZE)
          console.log(blob)
        }

        //上传
        let formData = new FormData()
        formData.append('act', 'api_msg_uploadimg')
        formData.append('file', blob || uploader.file)
        console.log(formData)

        let res = await axios.post('', formData, {
          no_loading: true,
        })

        console.log(res)

        if (!res || res.code != 0 || !res.data.file_name) {
          uploader.status = 'failed'
          uploader.message = '上传失败'
          return
        }
        uploader.file.$svr_url = res.data.file_name
        uploader.status = 'done'
        uploader.message = ''
        setTimeout(() => {
          console.log(this.filelist)
        }, 1000)
      } catch (ex) {
        console.log(ex)
        uploader.status = 'failed'
        uploader.message = '上传失败'
      } finally {
        Toast.clear()
      }
    },
    initPage() {
      axios
        .post(
          '',
          {
            act: 'api_msg_detail',
            msg_id: this.msgid,
            tp: this.tp,
          },
          {
            no_loading: true,
          },
        )
        .then(res => {
          if (!res || res.code != 0 || !res.data) {
            return
          }
          this.msg = res.data
          this.msg.msg_id = this.msgid
        })
    },
  },
  created() {
    this.msgid = this.$route.params.msgid
    this.tp = this.$route.params.tp
    // this.initPage()
    this.initPage()
  },
  mounted() {
    // console.log(this.msg)
  },
}
</script>

<style scoped>
.upload-info-label {
  float: right;
  transform: translateY(-4px);
  font-size: 0.8em;
  font-weight: 200;
  padding: 6px 0;
  color: #aaa;
}

.ycsb-button {
  width: 30vw;
}
</style>
