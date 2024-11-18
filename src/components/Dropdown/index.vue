<template>
  <div :class="{ 'dropdown': true, 'dropdown-isShow': state.isShow }"
       :style="{ top: state.top + 'px', left: state.left + 'px' }" ref="el">
    <component :is="state.option.content"/>
  </div>
</template>

<script setup>
const props = defineProps({
  option: {type: Object},
})
const el = ref(null)
const state = reactive({
  option: props.option,
  isShow: false,
  top: 0,
  left: 0,
})
defineExpose({
  showDropdown(option) {
    state.option = option;
    state.isShow = true;
    nextTick(() => { // 这里必须等待dom更新完成后再执行，否则获取的dropHeight为0
      let {top, left} = option.el.getBoundingClientRect();
      let canvasHeight = document.querySelector('.editor-container-canvas').clientHeight;
      let dropdownHeight = el.value.clientHeight;
      state.top = (top + dropdownHeight > canvasHeight) ? top - dropdownHeight : top; // 判断实现dropMenu是否会超出画布，并做出相应处理
      state.left = left;
    });
  },
})
const onMousedownDocument = (e) => {
  if (!el.value.contains(e.target)) { // 如果点击的是dropdown的内部，则什么都不做
    state.isShow = false;
  }
}

provide('hide', () => {
  state.isShow = false;
})
onMounted(() => {
  // 事件的传递行为是先捕获再冒泡
  // 之前为了阻止事件的传播，我们给所有的block都增加了stopPropagation
  document.addEventListener('mousedown', onMousedownDocument, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onMousedownDocument)
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.dropdown {
  display: none;
  position: absolute;
  box-shadow: .0429rem .0429rem .1143rem rgba($color: #000000, $alpha: .1);
  background-color: #fff;
  border-radius: .0714rem;
  border: #adb5bd .0143rem solid;
  width: 2.8571rem;
  padding-bottom: .0714rem;
  overflow: hidden;
  @include modal-z-index;
}

.dropdown-isShow {
  display: block;
}
</style>
