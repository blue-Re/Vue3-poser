<template>
  <h1>我是HelloWorld组件</h1>
  <h2>shallowReactive 与 shallowRef</h2>

  <h3>{{ person }}</h3>
  <p>{{ person.username }}</p>
  <p>{{ person.password }}</p>
  <p>{{ person.age }}</p>
  <button @click="person.age++">修改年龄</button>
  <br />
  <p>{{ person.job.name }}</p>
  <p>{{ person.job.salary }}k</p>
  <button @click="person.job.salary++">修改薪资</button>
  <button @click="changeInfo()">修改信息</button>
  <hr>
  <h1>被shallowRef修饰后得对象</h1>
  <p>{{person2.age}}</p>
  <button @click="person2={age: 8}">修改person2的年龄</button>
</template>

<script>
import { ref, reactive, toRef, toRefs, shallowReactive,shallowRef } from "vue";
export default {
  setup() {
    let sum = ref(0);
    const person = shallowReactive({
      username: "zhangsan",
      password: "999",
      age:1,
      job: {
        name: "Web前端",
        salary: 30,
      },
    });
    /* 使用shallowRef去修饰另一个对象 */
    const person2 = shallowRef({
      age:1
    })

    const changeInfo = () => {
      person.username = "aaaaaaaa";
      person.password = '111111111111111111111'
      person.job.name = "Java开发";
      person.job.salary++;
    };

    return {
      sum,
      person,
      person2,
      changeInfo,
    };
  },
};
</script>
