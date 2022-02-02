<template>
  <h1>watch监视</h1>
  <span>当前求和为: {{ sum }}</span>
  <button @click="sum++">点我+1</button>
  <p @click="message += '!'">{{ message }}</p>
  <hr />
  <p @click="person.name += '~'">姓名: {{ person.name }}</p>
  <p @click="person.age++">年龄: {{ person.age }}</p>
  <p>工作薪水:{{ person.job.Java.money }}k</p>
  <button @click="person.job.Java.money++">薪资上浮</button>
</template>

<script>
import { ref, watch, reactive } from "vue";
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
    /* 监视单个数据改变 */
    watch(
      sum,
      (newValue, oldValue) => {
        console.log(newValue, oldValue); // 1 0
      },
      {
        immediate: true,
        deep: true,
      }
    );

    /* 监视多个数据改变 */
    watch(
      [sum, message],
      (newValue, oldValue) => {
        console.log(newValue, oldValue); //  [0, '你好啊!']  [0, '你好啊']
      },
      {
        immediate: true,
      }
    );

    /* 监视reactive的数据的全部属性 */
    /* 问题:
      1.如果要监视reactive的数据,那么oldValue将无法正确获取
      2.默认开始了深度监视,关闭深度监视无效
    */
    watch(
      person,
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
      },
      {
        deep: false, // 此处的deep无效
      }
    );

    /* 监视reactive的数据的单个属性 */
    watch(
      () => person.name,
      (newValue, oldValue) => {
        console.log("person.name的值发生改变了!", newValue, oldValue);
      }
    );

    /* 监视reactive的数据的单些属性 */
    watch([() => person.name, () => person.age], (newValue, oldValue) => {
      console.log("person.name的值发生改变了!", newValue, oldValue);
    });

    /* 监视reactive的数据的对象属性 */
    watch(
      () => person.job,
      (newValue, oldValue) => {
        console.log("person.job内部的值发生改变了!", newValue, oldValue);
      },
      // 此处的deep有效
      { deep: true }
    );

    return {
      sum,
      message,
      person,
    };
  },
};
</script>

<style></style>
