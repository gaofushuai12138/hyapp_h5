<template>
  <div class="div-input" style="padding-bottom: 70px">
    <van-nav-bar title="新增用户组" left-arrow @click-left="onClickLeft" fixed>
    </van-nav-bar>
    <div class="div-title div-title-padbottom8">用户组名称</div>
    <van-cell-group style="padding-left: 10px; padding-right: 10px">
      <van-field
        v-model="workGroup.name"
        label="名称"
        placeholder="请输入用户组名称"
      />
    </van-cell-group>
    <div class="div-title div-title-padbottom8">选择用户</div>
    <van-field name="checkboxGroup" label="复选框组" style="padding-left:10px;padding-right:10px">
      <template #input >
        <van-checkbox-group v-model="checkboxGroup" direction="horizontal" >
          <van-checkbox name="1" shape="square">复选框 1</van-checkbox>
          <van-checkbox name="2" shape="square">复选框 2</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workGroup: {
        name: '',
        personlist: '',
      },
      checkboxGroup: [],
    }
  },
  methods: {
    onClickLeft() {
      window.$fygl_add_back = true
      history.back()
    },
  },
  mounted(){
    
  }
}
</script>

<style scoped>
.ycsb-button {
  width: 30vw;
}
</style>