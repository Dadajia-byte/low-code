<template>
    <template v-if="width && focusBlocksNum<2">
        <div class="block-resize block-resize-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'center'})"></div>
        <div class="block-resize block-resize-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'center'})"></div>
    </template>
    <template v-if="height && focusBlocksNum<2">
        <div class="block-resize block-resize-top" @mousedown="e=>onMouseDown(e,{horizontal:'center',vertical:'start'})"></div>
        <div class="block-resize block-resize-bottom" @mousedown="e=>onMouseDown(e,{horizontal:'center',vertical:'end'})"></div>
    </template>
        <template v-if="height && width && focusBlocksNum<2">
        <div class="block-resize block-resize-top-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'start'})"></div>
        <div class="block-resize block-resize-top-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'start'})"></div>
        <div class="block-resize block-resize-bottom-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',vertical:'end'})"></div>
        <div class="block-resize block-resize-bottom-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',vertical:'end'})"></div>
    </template>
</template>

<script setup>
const {component,focusBlocksNum,blockResizeMousedown:onMouseDown} = defineProps({
    component:{type:Object},
    focusBlocksNum:{type:Number},
    blockResizeMousedown:{type:Function}
})

const {width,height} = component.resize || {}
</script>

<style lang="scss" scoped>
$pre:"block-resize";
.#{$pre} {
    position: absolute;
    width:6px;
    height: 6px;
    background-color: #fff;
    border:1px solid #6965db;
    z-index: 1000;
    border-radius: 2px;
    user-select: none;
    
}
.#{$pre}-top {
    top: -7px;
    left: calc(50% - 3px);
    cursor: n-resize; /* 设置为向上箭头光标 */
}

.#{$pre}-bottom {
    bottom: -8px;
    left: calc(50% - 3px);
    cursor: s-resize; /* 设置为向下箭头光标 */
}

.#{$pre}-left {
    left: -7px;
    top: calc(50% - 3px);
    cursor: w-resize; /* 设置为向左箭头光标 */
}

.#{$pre}-right {
    right: -6px;
    top: calc(50% - 3px);
    cursor: e-resize; /* 设置为向右箭头光标 */
}

.#{$pre}-top-left {
    top: -7px;
    left: -7px;
    cursor: nw-resize; /* 设置为西北箭头光标 */
}

.#{$pre}-top-right {
    top: -7px;
    right: -6px;
    cursor: ne-resize; /* 设置为东北箭头光标 */
}

.#{$pre}-bottom-left {
    bottom: -8px;
    left: -7px;
    cursor: sw-resize; /* 设置为西南箭头光标 */
}

.#{$pre}-bottom-right {
    bottom: -8px;
    right: -6px;
    cursor: se-resize; /* 设置为东南箭头光标 */
}
</style>