<template>
  <h1>我是HelloWorld组件</h1>
  <span>当前求和为: {{ sum }}</span>
  <button @click="sum++">点我+1</button>
</template>

<script>
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  onUnmounted,
  ref,
} from "vue";
export default {
  setup() {
    let sum = ref(0);

    // 组合式API的生命周期函数
    console.log("setup------------");

    onBeforeMount(() => {
      console.log("onBeforeMount-------");
    });

    onMounted(() => {
      console.log("onMounted---------");
    });

    onBeforeUpdate(() => {
      console.log("onBeforeUpdate---------");
    });

    onUpdated(() => {
      console.log("onUpdated-------");
    });

    onBeforeUnmount(() => {
      console.log("onBeforeUnmount----");
    });

    onUnmounted(() => {
      console.log("onUnmounted-----");
    });

    return {
      sum,
    };
  },
};
</script>