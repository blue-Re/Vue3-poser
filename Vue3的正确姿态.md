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

### 1.5 计算属性

```js
<template>
  姓: <input type="text" v-model="person.firstName">
  名: <input type="text" v-model="person.lastName">
  <p>
    全名: <input v-model="person.fullName" />
  </p>
</template>

<script>
import {reactive, computed} from 'vue';

export default {
  setup() {
    const person  = reactive({
      firstName: '张',
      lastName: 'Ais',
    })
    /* 计算属性 简写 */
    /* person.fullName = computed(()=>{
      return person.firstName + '-' + person.lastName
    }) */

    /* 计算属性 完整写法 */
    person.fullName = computed({
      get(){
        return person.firstName + '-' + person.lastName
      },
      set(value){
        const nameArr = value.split("-");
        person.firstName = nameArr[0]
        person.lastName = nameArr[1]
      }
    })
    return {
      person
    }
  }
}
</script>

<style>

</style>
```

###  1.6 watch监视

两个注意点

1. watch监视reactive定义的响应式数据时: oldValue无法正确获取,强制开启了深度监视(deep配置失效),
2. watch监视reactive定义的响应式数据中的某个对象属性时,deep配置有效

==当watch监视ref数据时，对于基本类型的数据，不需要去 .value 这种方式去监视，当监视ref定义的对象数据时，实际上时借助了内部的reactive函数，也不需要去. value，只需要配置第三个配置对象内部的deep属性==

```js
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


```

### 1.7 watchEffect函数

watchEffect函数不用指明监视哪个属性，而是监视的回调中用到哪些属性，那就监视哪些属性。

watchEffect和computed有些类似

- computed更加注重的是计算出来的返回值
- watchEffect更注重的是过程，回调函数的函数体，不用写返回值

```js
<template>
  <h1>watchEffect函数</h1>
  <span>当前求和为: {{ sum }}</span>
  <button @click="sum++">点我+1</button>
  <p @click="message += '!'">{{ message }}</p>
  
</template>

<script>
import { ref, watch, reactive, watchEffect } from "vue";
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

    watchEffect(()=>{
      const initSum = sum.value;
      const age = person.age
      console.log('相关的数据发生了变化');
    })

    return {
      sum,
      message,
      person,
    };
  },
};
</script>


```

### 1.8 Vue3的生命周期函数

在Vue3中，也可以使用Vue2的配置生命周期函数，也可以使用Vue3提供的组合式API生命周期函数

Vue3.0也提供了 Composition API 形式的生命周期钩子，与Vue2.x中钩子对应关系如下：

- `beforeCreate`===>`setup()`
- `created`=======>`setup()`
- `beforeMount` ===>`onBeforeMount`
- `mounted`=======>`onMounted`
- `beforeUpdate`===>`onBeforeUpdate`
- `updated` =======>`onUpdated`
- `beforeUnmount` ==>`onBeforeUnmount`
- `unmounted` =====>`onUnmounted`

注意：

1. Vue2的每个配置生命周期函数执行时时机都比Vue3的组合式API执行慢一步
2. 将`beforeCreate以及created`两个钩子函数柔和到`setup`当中

```js
<template>
  <h1>我是HelloWorld组件</h1>
  <span>当前求和为: {{ sum }}</span>
  <button @click="sum++">点我+1</button>
</template>

<script>
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  onUnmounted,
  ref,
} from "vue";
export default {
  setup() {
    let sum = ref(0);

    // 组合式API的生命周期函数
    console.log("setup------------");

    onBeforeMount(() => {
      console.log("onBeforeMount-------");
    });

    onMounted(() => {
      console.log("onMounted---------");
    });

    onBeforeUpdate(() => {
      console.log("onBeforeUpdate---------");
    });

    onUpdated(() => {
      console.log("onUpdated-------");
    });

    onBeforeUnmount(() => {
      console.log("onBeforeUnmount----");
    });

    onUnmounted(() => {
      console.log("onUnmounted-----");
    });

    return {
      sum,
    };
  },
};
</script>
```

### 1.9 自定义hooks函数，体会组合式API的优势

将一个功能函数使用组合式API进行统一封装，其他模块只需要进行调用使用即可，不需要去在意函数内部的实现逻辑！

`hooks文件夹下的usePoint.js函数`

```js
import { reactive, onMounted, onBeforeUnmount } from 'vue'

export default function () {
  const point = reactive({
    x: 0,
    y: 0,
  });
  /* 获取鼠标焦点的自定义hooks函数 */
  function getPointPosition(event) {
    point.x = event.pageX;
    point.y = event.pageY;
    console.log(point.x, point.y);
  }

  onMounted(() => {
    window.addEventListener("click", getPointPosition);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("click", getPointPosition);
  });
  // 将坐标对象交出去，让其他模块可以使用该模块的功能
  return point
}
```

`HelloWorld组件`

```js
<template>
  <h1>我是HelloWorld组件</h1>
  <h2>自定义获取鼠标坐标hooks函数</h2>
  <span>
    x的坐标: {{ point.x }}
    <br />
    y的坐标: {{ point.y }}
  </span>
</template>

<script>
import { ref } from "vue";
import getPointHooks from '../hooks/usePoint'
export default {
  setup() {
    let sum = ref(0);
    // 获取自定义模块的hooks函数
    let point = getPointHooks()

    return {
      sum,
      point,
    };
  },
};
</script>

```

`App组件`

```js
<template>
  <div>
    <button @click="isShow = !isShow">展示/隐藏 组件</button>
    <HelloWorld v-if="isShow" />
  </div>
</template>

<script>
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: { HelloWorld },
  setup() {
    let sum = ref(0);
    let isShow = ref(true);
    return {
      sum,
      isShow,
    };
  },
};
</script>
```

### 1.10 toRef与toRefs的使用

- 作用：创建一个 ref 对象，其value值指向另一个对象中的某个属性。
- 语法：```const name = toRef(person,'name')```
- 应用:   要将响应式对象中的某个属性单独提供给外部使用时。


- 扩展：```toRefs``` 与```toRef```功能一致，但可以批量创建多个 ref 对象，语法：```toRefs(person)```

```js
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

```

## 二、其他不常用CompositionAPI

### 2.1 shallowReactive 与 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。

- 什么时候使用?
  -  如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> shallowReactive。
  -  如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> shallowRef。

```js
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

```

