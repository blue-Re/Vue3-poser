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