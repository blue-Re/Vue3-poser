<template>
  <p>用户名: {{ username }}</p>
  <p>密码: {{ password }}</p>
  <button @click="changeInfo()">修改信息</button>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    /* 想要让一个基本类型的数据变成响应式就需要接入ref函数 */
    let username = ref("sss");
    let password = ref("password");

    // 修改响应式数据的方法
    const changeInfo = () => {
      /* 想要修改数据,需要通过 .value的形式拿到,而在template中直接使用即可 */
      username.value = "username";
      password.value = "密码";
    };

    return {
      username,
      password,
      changeInfo,
    };
  },
};
</script>

<style></style>
