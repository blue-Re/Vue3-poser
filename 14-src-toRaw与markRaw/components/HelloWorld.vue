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
