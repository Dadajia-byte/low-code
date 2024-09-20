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

const {block,component} = defineProps({
    block:{type:Object},
    component:{type:Object}
})
const {width,height} = component.resize || {}
let data ={}
const onMouseMove = (e)=>{
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
}
const onMouseUp = ()=>{
    console.log(111);
    
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
    width: 8px;
    height: 8px;
    background-color: #337ecc;
    z-index: 1000;
    border-radius: 4px;
    user-select: none;
    
}
.#{$pre}-top{
    top:-3px;
    left: calc(50% - 3px);
}
.#{$pre}-bottom {
    bottom: -3px;
    left: calc(50% - 3px);
}
.#{$pre}-left {
    left: -3px;
    top: calc(50% - 3px);
}
.#{$pre}-right {
    right: -3px;
    top: calc(50% - 3px);
}
.#{$pre}-top-left {
    top: -3px;
    left: -3px;
}
.#{$pre}-top-right {
    top: -3px;
    right: -3px;
}
.#{$pre}-bottom-left {
    bottom: -3px;
    left: -3px;
}
.#{$pre}-bottom-right {
    bottom: -3px;
    right: -3px;
}
</style>