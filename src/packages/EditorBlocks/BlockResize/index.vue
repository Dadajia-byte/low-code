<template>
    <template v-if="width">
        <div class="block-resize block-resize-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',verical:'center'})"></div>
        <div class="block-resize block-resize-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',verical:'center'})"></div>
    </template>
    <template v-if="height">
        <div class="block-resize block-resize-top" @mousedown="e=>onMouseDown(e,{horizontal:'center',verical:'start'})"></div>
        <div class="block-resize block-resize-bottom" @mousedown="e=>onMouseDown(e,{horizontal:'center',verical:'end'})"></div>
    </template>
        <template v-if="height && width">
        <div class="block-resize block-resize-top-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',verical:'start'})"></div>
        <div class="block-resize block-resize-top-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',verical:'start'})"></div>
        <div class="block-resize block-resize-bottom-left" @mousedown="e=>onMouseDown(e,{horizontal:'start',verical:'end'})"></div>
        <div class="block-resize block-resize-bottom-right" @mousedown="e=>onMouseDown(e,{horizontal:'end',verical:'end'})"></div>
    </template>
</template>

<script setup>
import { useEditorDataStore } from '../../../store/module/editorData';
const EditorDataStore = useEditorDataStore();
const {block,component} = defineProps({
    block:{type:Object},
    component:{type:Object}
})
const {width,height} = component.resize || {}
let data ={}
const onMouseMove = (e)=>{
    console.log(111);
    
    let {clientX,clientY} = e;
    let {startX,startY,startWidth,startHeight,startLeft,startTop,direction} = data;

    if(direction.horizontal ==='center') {
        clientX = startX;
    }
    if(direction.verical ==='center') {
        clientY = startY;
    }
    let durX = clientX-startX;
    let durY = clientY-startY;
    
    if (direction.verical === 'start') {
        durY = durY*-1;
        block.top = startTop - durY;
    }
    if (direction.horizontal === 'start') {
        durX = durX*-1;
        block.left = startLeft - durX;
    }
    
    const width = startWidth + durX;
    const height = startHeight + durY;
    block.width = width;
    block.height = height;
    block.hasResize = true;
    console.log(block);
    
    EditorDataStore.updateBlocks(block);
}
const onMouseUp = ()=>{
    document.body.removeEventListener('mousemove',onMouseMove)
    document.body.removeEventListener('mouseup',onMouseUp)
}
const onMouseDown = (e,direction)=>{
    e.stopPropagation();
    data = {
        startX:e.clientX,
        startY:e.clientY,
        startWidth:block.width,
        startHeight:block.height,
        startLeft:block.left,
        startTop:block.top,
        direction
    }
    
    document.body.addEventListener('mousemove',onMouseMove)
    document.body.addEventListener('mouseup',onMouseUp)
}
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