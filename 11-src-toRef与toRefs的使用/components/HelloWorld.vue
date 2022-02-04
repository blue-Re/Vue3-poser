<template>
  <h1>我是HelloWorld组件</h1>
  <h2>toRef与toRefs</h2>

  <h3>{{ person }}</h3>
  <p>{{ person.username }}</p>
  <p>{{ person.password }}</p>
  <br />
  <p>{{ person.job.name }}</p>
  <p>{{ person.job.salary }}k</p>
  <button @click="changeInfo()">修改信息</button>
  <hr />
  <h1>使用toRef交出去的属性</h1>
  <p>用户名： {{ name }}</p>
  <p>密码： {{ password }}</p>
</template>

<script>
import { ref, reactive, toRef, toRefs } from "vue";
export default {
  setup() {
    let sum = ref(0);
    const person = reactive({
      username: "zhangsan",
      password: "999",
      job: {
        name: "Web前端",
        salary: 30,
      },
    });
    const changeInfo = () => {
      person.username = "aaaaaaaa";
      person.password = '111111111111111111111'
      person.job.name = "Java开发";
      person.job.salary++;
    };

    // toRef的使用 想把person身上的某个单个属性单独交出去使用
    const name = toRef(person, "username");
    const password = toRef(person, "password");

    return {
      sum,
      person,
      changeInfo,
      name,
      password,
      // toRefs的使用 把person身上的所有属性全部交出去
      ...toRefs(person)
    };
  },
};
</script>
