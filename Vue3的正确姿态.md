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
      age:donlyzRead

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

### 2.2 readonly与shallowReadonly

- readonly：让一个响应式数据变为只读数据（深只读，嵌套的深层次数据不可以被修改）
- shallowReadonly：让一个响应式数据变为只读的（浅只读，嵌套的深层次数据可以被修改，第一层数据不可以被修改）

==当数据不希望被修改时可以用其来阻止修改行为==

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

```

### 2.3 toRaw与markRaw

- toRaw 将一个有`reactive`标记的响应式对象转变成一个普通对象，简单讲就是使这个对象丢失掉响应式

  ==用于：需要数据改变，但不引起页面更新的需求==

- markRaw：标记一个对象，让其永远不会变为响应式对象

  ==有时需要我们给特定的响应式对象身上添加某个属性，但是不希望他是响应式的，所以就需要用到这个==

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
    <p v-show="person.car">{{ person.car }}</p>
    <button @click="person.job.salary++">修改薪资</button>
    <button @click="changeInfo()">修改信息</button>
    <button @click="changeRawObj">将响应式对象变为原始对象</button>
    <button @click="addCar">添加一辆车</button>
    <button @click="person.car.name += '~'">修改车的名字</button>
    <hr />
  </template>
  
  <script>
  import {
    ref,
    toRaw,
    shallowReactive,
    shallowRef,
    readonly,
    shallowReadonly,
    markRaw,
  } from "vue";
  export default {
    setup() {
      let sum = ref(0);
      let person = shallowReactive({
        username: "zhangsan",
        password: "999",
        age: 1,
        job: {
          name: "Web前端",
          salary: 30,
        },
      });
  
      const changeInfo = () => {
        person.username = "aaaaaaaa";
        person.password = "111111111111111111111";
        person.job.name = "Java开发";
        person.job.salary++;
      };
      const changeRawObj = () => {
        // 将reactive定义的响应式对象变为原始对象
        const rawObj = toRaw(person);
        console.log(rawObj);
      };
      const addCar = () => {
        let car = markRaw({
          name: "宝马",
          price: "30w",
        });
        person.car = car;
      };
      return {
        sum,
        person,
        changeInfo,
        addCar,
        changeRawObj,
      };
    },
  };
  </script>
  
  ```

  ### 2.4 customRef
  
  创建一个自定义的ref，对其依赖项进行跟踪和触发进行控制
  
  ```js
  <template>
    <h1>自定义Ref</h1>
    <input v-model="keyWord" /> <br />
    <span>{{ keyWord }}</span>
  </template>
  
  <script>
  import { customRef } from 'vue'
  export default {
    setup() {
      function myRef(value, delay) {
        let timer;
        return customRef((track, trigger)=>{
          return {
            get(){
              console.log(`有人从myRef这个容器中读取数据了，值为${value}`);
              // track函数用于 追踪 value 值的改变
              track();
              return value
            },
  
            set(newValue){
              console.log(`myRef容器的数据被修改了,值为${newValue}`);
              clearTimeout(timer)
              timer = setTimeout(()=>{
                value = newValue;
                // 通知Vue去重新解析模板
                trigger()
              }, delay)
            }
          }
        })
      }
      
      let keyWord = myRef("HelloWorld", 10);
  
  
      return {
        keyWord,
      };
    },
  };
  </script>
  
  ```
  
  

### 2.4 provide与inject

使用`provide与inject`来实现根组件与后代组件的通信，当然子组件也可以获取到provide所提供的数据，我们一般直接使用props就可以了

```
父组件:
provide('通信名', 通信数据)

子组件
const data = inject('通信名')
```

### 2.5 响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

## 三、新的组件

### 3.1Fragment

- 在Vue2中: 组件必须有一个根标签
- 在Vue3中: 组件可以没有根标签, 内部会将多个标签包含在一个Fragment虚拟元素中
- 好处: 减少标签层级, 减小内存占用

### 3.2 Teleport

- 什么是Teleport？—— `Teleport` 是一种能够将我们的<strong style="color:#DD5145">组件html结构</strong>移动到指定位置的技术。

  ```vue
  <teleport to="移动位置"> // to="body | html | div| #box ..."
  	<div v-if="isShow" class="mask">
  		<div class="dialog">
  			<h3>我是一个弹窗</h3>
  			<button @click="isShow = false">关闭弹窗</button>
  		</div>
  	</div>
  </teleport>
  ```

  

### 3.3 Suspense

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验

- 使用步骤：

  - 异步引入组件

    ```js
    import {defineAsyncComponent} from 'vue'
    const Child = defineAsyncComponent(()=>import('./components/Child.vue'))
    ```

  - 使用```Suspense```包裹组件，并配置好```default``` 与 ```fallback```

    ```vue
    <template>
    	<div class="app">
    		<h3>我是App组件</h3>
    		<Suspense>
    			<template v-slot:default>
    				<Child/>
    			</template>
    			<template v-slot:fallback>
    				<h3>加载中.....</h3>
    			</template>
    		</Suspense>
    	</div>
    </template>
    ```

## 四、其他

### 4.1 全局API的转移

- Vue 2.x 有许多全局 API 和配置。

  - 例如：注册全局组件、注册全局指令等。

    ```js
    //注册全局组件
    Vue.component('MyButton', {
      data: () => ({
        count: 0
      }),
      template: '<button @click="count++">Clicked {{ count }} times.</button>'
    })
    
    //注册全局指令
    Vue.directive('focus', {
      inserted: el => el.focus()
    }
    ```

- Vue3.0中对这些API做出了调整：

  - 将全局的API，即：```Vue.xxx```调整到应用实例（```app```）上

    | 2.x 全局 API（```Vue```） | 3.x 实例 API (`app`)                        |
    | ------------------------- | ------------------------------------------- |
    | Vue.config.xxxx           | app.config.xxxx                             |
    | Vue.config.productionTip  | <strong style="color:#DD5145">移除</strong> |
    | Vue.component             | app.component                               |
    | Vue.directive             | app.directive                               |
    | Vue.mixin                 | app.mixin                                   |
    | Vue.use                   | app.use                                     |
    | Vue.prototype             | app.config.globalProperties                 |

### 4.2 其他改变

- data选项应始终被声明为一个函数。

- 过度类名的更改：

  - Vue2.x写法

    ```css
    .v-enter,
    .v-leave-to {
      opacity: 0;
    }
    .v-leave,
    .v-enter-to {
      opacity: 1;
    }
    ```

  - Vue3.x写法

    ```css
    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
    
    .v-leave-from,
    .v-enter-to {
      opacity: 1;
    }
    ```

- <strong style="color:#DD5145">移除</strong>keyCode作为 v-on 的修饰符，同时也不再支持```config.keyCodes```

- <strong style="color:#DD5145">移除</strong>```v-on.native```修饰符

  - 父组件中绑定事件

    ```vue
    <my-component
      v-on:close="handleComponentEvent"
      v-on:click="handleNativeClickEvent"
    />
    ```

  - 子组件中声明自定义事件

    ```vue
    <script>
      export default {
        emits: ['close']
      }
    </script>
    ```


## 五、在Vue3中集成TS

首先，在Vue3中集成TS后，对应的组件写法如下

```
<template>

</template>

<script lang="ts">
// 需要引入 defineComponent 来定义组件 对组件中数据的类型进行限制
import {defineComponent} from 'vue'

export default defineComponent({
  name:''
  
})
</script>
```

### 5.1 初次集成TS

```vue
<template>
  <hr />
  <h2>我是HelloWorld组件</h2>
  <hr />
  <div>{{ msg }}</div>
  <button @click="changeMsg()">修改数据</button>
  <div>{{ newsData }}</div>
  <div>{{newsData2}}</div>
  <div>计算属性: {{newMsg}}</div>
  <hr />
  <p>setup的数据</p>
  <div>{{ new2 }}</div>
  <button @click="changeMsg2()">修改new2的数据</button>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

const msg = "我是一个类型校验的数据";

interface News {
  title: string;
  id: number;
  desc: string;
  content?: string;
}
// 第一种写法
let newsData: News = {
  title: "消息1",
  id: 1,
  desc: "我是消息1",
};


export default defineComponent({
  name: "HelloWorld.vue",
  data() {
    return {
      msg,
      newsData,
      // 第二种写法
      newsData2: {
        title: "消息2",
        id: 2,
        desc: "我是消息2",
      } as News,
    };
  },
  methods: {
    changeMsg(): void {
      this.msg = "修改后的数据";
    },
  },
  computed: {
    newMsg(): string {
      return this.msg.split("").reverse().join("")
    }
  },
  setup() {
    let new2: News = reactive({
      title: "消息1",
      id: 1,
      desc: "我是消息1",
      content: "今日事今日毕",
    });
    function changeMsg2(): void {
      new2.title += "!";
      new2.id += 1;
    }
    return {
      new2,
      changeMsg2,
    };
  },
});
</script>

```

### 5.2 在Composition API中 集成TS

```vue
<template>
  <hr />
  <h2>我是HelloWorld组件</h2>
  <h3>在Vue3中Composition API 集成TS</h3>
  <p>姓名： {{ username }}</p>
  <p>年龄： {{ age }}</p>
  <button @click="setUserName('aaaaaaaa')">换名字</button>
  <p>读年龄： {{ getUserName() }}</p>
  <hr />
  <p>校验ref数据类型：{{ count }}</p>
  <p>计算属性： {{reverseName}}</p>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";

interface User {
  username: string;
  age: number | string;
  setUserName(username: string): void;
  getUserName(): string;
}

export default defineComponent({
  name: "HelloWorld.vue",
  setup() {
    /* 类型校验的第一种写法 */
    /* const user: User = reactive({
      username: "张三",
      age: 10,
      getUserName(): string {
        return this.username;
      },
      setUserName(usesrname: string): void {
        this.username = usesrname;
      }
    }); */
    /* 类型校验的第二种写法 */
    /* const user = reactive<User>({
      username: "张三",
      age: 10,
      getUserName(): string {
        return this.username;
      },
      setUserName(usesrname: string): void {
        this.username = usesrname;
      }
    }); */
    /* 类型校验的第三种写法 */
    const user = reactive({
      username: "张三",
      age: 10,
      getUserName(): string {
        return this.username;
      },
      setUserName(usesrname: string): void {
        this.username = usesrname;
      },
    }) as User;
    console.log(toRefs(user));

    /* 校验 ref 数据类型 */
    // let count: string = ref('22'); // Type 'Ref<string>' is not assignable to type 'string'.
    let count = ref<number | string>("22");

    /* 测试计算属性 */
    let reverseName = computed((): string => {
      return user.username.split("").reverse().join("");
    });
    console.log(reverseName);
    
    return {
      ...toRefs(user),
      count,
      reverseName,
    };
  },
});
</script>

```

### 5.3 在Composition中使用Vuex

`store.ts`

```ts
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    changeCount(state,payload) {
      // state.count++
      state.count = payload
    }
  },
  actions: {
    asyncChangeCount({commit}, payload) {
      setTimeout(()=>{
        commit('changeCount', payload)
      },1000)
    }
  },
  getters: {
    countGetter(state){
      return state.count * 10;
    },
  },
  modules: {
  }
})

```

`app.vue`

在组合式API中要想访问Vuex需要借助 `useStore`

```vue
<template>
  <h1>我是App根组件</h1>
  <h2>在Vuex中集成TS</h2>
  <p>当前count为：{{count}}</p>
  <button @click="changeCount()">更改Vuex中的count</button>
  <hr>
  <p>getters: {{countGetters}}</p>
</template>

<script lang="ts">

import { defineComponent, computed } from "vue";
import { useStore } from 'vuex';


export default defineComponent({
  name: "App.vue",
  setup() {
    const store = useStore()
    let count = computed(()=>{
      return store.state.count
    })
    const changeCount = ()=>{
      // store.commit('changeCount')
      store.dispatch('asyncChangeCount', 20)
    }
    const countGetters = computed(()=>{
      return store.getters.countGetter
    })
    return {
      count,
      changeCount,
      countGetters
    }
  }
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

```

