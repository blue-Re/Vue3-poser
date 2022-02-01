<template>
  <h1>我是App组件</h1>
  <hr />
  <HelloWorld 
    @sayHello="sayHello"
    msg="Hello Vue 3.0 + Vite" 
    test="我是测试信息" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    const sayHello = (params) => {
      alert(`我是自定事件,我的参数是${params}`);
    };

    return {
      sayHello,
    };
  },
};
</script>
