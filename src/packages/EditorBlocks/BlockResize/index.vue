<template>
  <template v-if="width && focusBlocksNum<2">
    <div class="block-resize block-resize-left"
         @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'center'})"></div>
    <div class="block-resize block-resize-right"
         @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'center'})"></div>
  </template>
  <template v-if="height && focusBlocksNum<2">
    <div class="block-resize block-resize-top"
         @mousedown="e=>onMouseDown(e,{horizontal:'center',vertical:'start'})"></div>
    <div class="block-resize block-resize-bottom"
         @mousedown="e=>onMouseDown(e,{horizontal:'center',vertical:'end'})"></div>
  </template>
  <template v-if="height && width && focusBlocksNum<2">
    <div class="block-resize block-resize-top-left"
         @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'start'})"></div>
    <div class="block-resize block-resize-top-right"
         @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'start'})"></div>
    <div class="block-resize block-resize-bottom-left"
         @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'end'})"></div>
    <div class="block-resize block-resize-bottom-right"
         @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'end'})"></div>
  </template>
</template>

<script setup>
const {component, focusBlocksNum, blockResizeMousedown: onMouseDown} = defineProps({
  component: {type: Object},
  focusBlocksNum: {type: Number},
  blockResizeMousedown: {type: Function}
})

const {width, height} = component.resize || {}
</script>

<style lang="scss" scoped>
$pre: "block-resize";
.#{$pre} {
  position: absolute;
  width: .0857rem;
  height: .0857rem;
  background-color: #fff;
  border: .0143rem solid #6965db;
  z-index: 1000;
  border-radius: .0286rem;
  user-select: none;

}

.#{$pre}-top {
  top: -0.1rem;
  left: calc(50% - .0429rem);
  cursor: n-resize; /* 设置为向上箭头光标 */
}

.#{$pre}-bottom {
  bottom: -0.1143rem;
  left: calc(50% - .0429rem);
  cursor: s-resize; /* 设置为向下箭头光标 */
}

.#{$pre}-left {
  left: -0.1rem;
  top: calc(50% - .0429rem);
  cursor: w-resize; /* 设置为向左箭头光标 */
}

.#{$pre}-right {
  right: -0.0857rem;
  top: calc(50% - .0429rem);
  cursor: e-resize; /* 设置为向右箭头光标 */
}

.#{$pre}-top-left {
  top: -0.1rem;
  left: -0.1rem;
  cursor: nw-resize; /* 设置为西北箭头光标 */
}

.#{$pre}-top-right {
  top: -0.1rem;
  right: -0.0857rem;
  cursor: ne-resize; /* 设置为东北箭头光标 */
}

.#{$pre}-bottom-left {
  bottom: -0.1143rem;
  left: -0.1rem;
  cursor: sw-resize; /* 设置为西南箭头光标 */
}

.#{$pre}-bottom-right {
  bottom: -0.1143rem;
  right: -0.0857rem;
  cursor: se-resize; /* 设置为东南箭头光标 */
}
</style>