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
