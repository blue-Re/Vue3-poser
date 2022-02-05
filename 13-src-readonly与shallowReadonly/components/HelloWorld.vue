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
</template>

<script>
import { ref, reactive, toRef, toRefs, shallowReactive,shallowRef, readonly, shallowReadonly } from "vue";
export default {
  setup() {
    let sum = ref(0);
    let person = shallowReactive({
      username: "zhangsan",
      password: "999",
      age:1,
      job: {
        name: "Web前端",
        salary: 30,
      },
    });
    /* 使用readonly标记响应式数据只是可读的 */
    // person = readonly(person)

    // 使用shallowReadonly来标记数据
    person = shallowReadonly(person)

    const changeInfo = () => {
      person.username = "aaaaaaaa";
      person.password = '111111111111111111111'
      person.job.name = "Java开发";
      person.job.salary++;
    };

    return {
      sum,
      person,
      changeInfo,
    };
  },
};
</script>
