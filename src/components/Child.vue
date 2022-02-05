<template>
  <div class="child">
    <h1>我是子组件</h1>
    <Son />
  </div>
</template>

<script>
import Son from "./Son.vue";
export default {
  components: { Son },
};
</script>

<style>
.child {
  background-color: orange;
  padding: 20px;
}
</style>
