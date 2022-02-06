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
