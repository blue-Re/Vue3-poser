# Vue3的正确姿态

## 一. 与Composition组合式API的邂逅

### 1.1 与setup的初次交集

1. setup是Vue3的新的配置项,值为一个函数

2. 组件所用到的所有的属性和方法都需要配置在setup当中,然后将其return在一个对象内部,供模板使用

3. 在Vue2的配置项中可以访问到setup的数据,但是在setup当中不可以访问Vue2的数据;**出现重名会优先显示setup定义的数据**

4. setup前面不可以添加一个async,因为返回值不再是一个return的对象,而且是promise,模板看不到return对象中的属性;

   也可以返回一个Promise实例,但需要Suspence和异步组件配合

```js
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
```



### 1.2 ref函数

通常情况下,我们用ref是用来将基本数据类型变成响应式数据类型,这个时候就需要借助到ref函数

对于基本类型的数据,响应式依然是靠`Object.defineProperty()`的get和set去完成的;

对于引用类型的数据,内部使用了一个`reactive`函数

1. 在模板中正常使用setup返回的数据源即可
2. 如果想要修改数据,只能是通过`属性名.value`去修改

```js
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

```

### 1.3 reactive函数

通常情况下,我们会使用reactive来创建一个响应式对象,用来存放对应的数据源;

```js
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

```

### 1.4 setup的注意点

- setup执行的时机
  - 在beforeCreate之前执行一次，this是undefined。

- setup的参数
  - props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性。
  - context：上下文对象
    - attrs: 值为对象，包含：组件外部传递过来，但没有在props配置中声明的属性, 相当于 ```this.$attrs```。
    - slots: 收到的插槽内容, 相当于 ```this.$slots```。
    - emit: 分发自定义事件的函数, 相当于 ```this.$emit```。

