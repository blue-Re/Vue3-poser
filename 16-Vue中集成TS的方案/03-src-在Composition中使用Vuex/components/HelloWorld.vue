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
