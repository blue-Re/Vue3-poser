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

