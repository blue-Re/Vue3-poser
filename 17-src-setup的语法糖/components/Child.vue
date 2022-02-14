<template>
  <div class="child">
    <h1>我是子组件</h1>
    <Son food="123" game="lol"  @myEmit="handleClick"/>
  </div>
</template>

<script>
import Son from "./Son.vue";
export default {
  components: { Son },
  setup() {
    const handleClick = (data)=>{
      console.log('自定义事件', data);
    }
    return {
      handleClick
    }
  }
};
</script>

<style>
.child {
  background-color: orange;
  padding: 20px;
}
</style>
