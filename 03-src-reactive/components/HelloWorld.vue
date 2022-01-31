<template>
  <p>{{ person.username }}</p>
  <p>{{ person.password }}</p>
  <br />
  <p>{{ person.job.name }}</p>
  <button @click="changeInfo()">修改信息</button>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
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
    return {
      person,
      changeInfo,
    };
  },
};
</script>

<style></style>
