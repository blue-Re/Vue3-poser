<template>
  <h1>我是子组件</h1>
  <p>{{ person.username }}</p>
  <p>{{ person.password }}</p>
  <br />
  <p>{{ person.job.name }}</p>
  <button @click="changeInfo()">修改信息</button>
  <button @click="test">测试自定义事件</button>
</template>

<script>
import { reactive } from "vue";
export default {
  emits: ["sayHello"],
  setup(props, context) {
    console.log(props, context);
    const person = reactive({
      username: "zhangsan",
      password: "999",
      job: {
        name: "Web前端",
        salary: "30k",
      },
    });
    const changeInfo = () => {
      (person.username = "aaaaaaaa"), (person.job.name = "Java开发");
    };
    // 测试自定义事件
    const test = ()=>{
      context.emit('sayHello','我是自定义事件带过去的参数')
    }
    return {
      person,
      changeInfo,
      test
    };
  },
};
</script>

<style></style>
