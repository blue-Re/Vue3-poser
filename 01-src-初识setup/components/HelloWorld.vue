<template>
  <h1>我是Vue3测试组件</h1>
  <p>{{username}}---{{password}}</p>
  <button @click="sayHello">说你好</button>
  <hr>
  <h2>以下是Vue2的数据和方法</h2>
  <p>{{vue2.username}}--{{vue2.password}}</p>
  <button @click="Vue2SayHello">触发Vue2的方法</button>
  <button @click="sayHello">触发Vue3的方法</button>
</template>

<script>
export default {
  setup() {
    /* 
      我们通常在setup中直接定义属性和方法,然后需要将其返回
      然后就可以在模板当中去直接使用
    */
    /* 
      在Vue2中可以触发setup中的属性和方法
      但在setup当中不可以触发Vue2的属性和方法
    */
    let username = '123';
    let password = '456';

    const sayHello = ()=>{
      alert('Vue3你好啊');
    }
    return {
      username,password,sayHello
    }
  },
  data() {
    return {
      vue2: {
        username:'Vue2',
        password: '123123'
      }
    }
  },
  methods: {
    Vue2SayHello(){
      alert('我是Vue2的方法')
    }
  },
}
</script>

<style>

</style>