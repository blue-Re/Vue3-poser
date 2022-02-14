<template>
  <div class="root">
    <h1>我是根组件</h1>
    <li v-for="item in games">{{item}}</li>
    <Child />
  </div>
</template>

<script>
import Child from "./components/Child.vue";
import { provide } from "vue";
export default {
  components: { Child },
  setup() {
    let games = ["LOL", "CF", "DNF"];
    provide('games', games)
    return {
      games,
    };
  },
};
</script>

<style>
.root {
  background-color: skyblue;
  padding: 20px;
}
</style>
