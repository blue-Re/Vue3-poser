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
