<template>
  <div>
    <HelloWorld v-if="isShow" />
    <button @click="isShow = !isShow">展示/隐藏 组件</button>
  </div>
</template>

<script>
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: { HelloWorld },
  setup() {
    let sum = ref(0);
    let isShow = ref(true);
    return {
      sum,
      isShow,
    };
  },
};
</script>
