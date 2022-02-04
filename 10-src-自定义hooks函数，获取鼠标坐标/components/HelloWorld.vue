<template>
  <h1>我是HelloWorld组件</h1>
  <h2>自定义获取鼠标坐标hooks函数</h2>
  <span>
    x的坐标: {{ point.x }}
    <br />
    y的坐标: {{ point.y }}
  </span>
</template>

<script>
import { ref } from "vue";
import getPointHooks from '../hooks/usePoint'
export default {
  setup() {
    let sum = ref(0);
    // 获取自定义模块的hooks函数
    let point = getPointHooks()

    return {
      sum,
      point,
    };
  },
};
</script>
