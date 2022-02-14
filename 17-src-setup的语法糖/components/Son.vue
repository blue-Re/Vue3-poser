<template>
  <div class="son">
    <h1>我是孙组件</h1>
    <ul>
      根组件传过来的数据为
      <li v-for="item in games">{{ item }}</li>
    </ul>
    <hr />
    <Test />
    <p>{{ count }}</p>
    <button @click="add">点我+1</button>
    <hr>
    <p>父组件的props：{{props}}</p>
    <button @click="handleClick">发射</button>
  </div>
</template>

<script setup>
import { inject, ref, defineProps,defineEmits } from "vue";
import Test from "./Test.vue";
const games = inject("games");
const count = ref(0);
// 暴露方法
const add = () => {
  count.value++;
};

// 获取props
const props = defineProps(['game', 'food'])
// 获取emit
const emits = defineEmits(['myEmit'])
const handleClick = ()=> {
  emits('myEmit',{name: '我时发射的事件', data: '我时携带的数据',msg: '点了我'})
}
</script>

<style>
.son {
  background-color: pink;
  padding: 20px;
}
</style>
