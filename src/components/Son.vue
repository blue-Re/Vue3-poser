<template>
  <div class="son">
    <h1>我是孙组件</h1>
    <ul>
      根组件传过来的数据为
      <li v-for="item in games">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  setup() {
    const games = inject("games");
    return {
      games,
    };
  },
};
</script>

<style>
.son {
  background-color: pink;
  padding: 20px;
}
</style>
