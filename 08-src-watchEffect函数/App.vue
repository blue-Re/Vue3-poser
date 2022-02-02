<template>
  <h1>watchEffect函数</h1>
  <span>当前求和为: {{ sum }}</span>
  <button @click="sum++">点我+1</button>
  <p @click="message += '!'">{{ message }}</p>
  
</template>

<script>
import { ref, watch, reactive, watchEffect } from "vue";
export default {
  setup() {
    let sum = ref(0);
    let message = ref("你好啊");
    const person = reactive({
      name: "王五",
      age: 12,
      job: {
        Java: {
          money: 20,
        },
      },
    });

    watchEffect(()=>{
      const initSum = sum.value;
      const age = person.age
      console.log('相关的数据发生了变化');
    })

    return {
      sum,
      message,
      person,
    };
  },
};
</script>

