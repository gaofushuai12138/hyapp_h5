<template>
  <div>

    dsda
    <van-calendar v-model:show="show" :min-date="minDate" :max-date="maxDate" />
    <van-button @click="show = true"></van-button>
  </div>
</template>


<script>
import {ref} from 'vue';
export default {
  setup() {
    const show = ref(false);

    return {
      show,
      minDate: new Date(2022, 0, 1),
      maxDate: new Date(2022, 0, 31),
    };
  },
};
</script>