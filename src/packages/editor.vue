<template>
<div class="editor">
  <!-- 左侧物料堆 -->
  <div class="editor-left">
    <div draggable="true" 
      @dragstart="(e)=>dragStart(e,item)" 
      class="editor-left-item" 
      v-for="(item,index) in config.componentList" 
      :key="index">
      <span>{{ item.label }}</span>
      <component :is="item.preview"></component>
    </div>
  </div>
  <!-- 顶部菜单栏 -->
  <div class="editor-top">菜单栏</div>
  <!-- 右侧属性控制栏 -->
  <div class="editor-right">属性控制栏</div>
  <!-- 中间画布 -->
  <div class="editor-container">
    <!-- 产生滚动条 -->
    <div class="editor-container-canvas">
      <!-- 产生内容区域 -->
       <div class="editor-container-canvas-content" ref="containerRef" :style="containerStyles">
        <div v-for="item in data.blocks" :key="item.key">
          <EditorBlocks :block="item" ></EditorBlocks>
        </div>
       </div>
    </div>
  </div>
</div>
</template>
<script setup>
/* 编辑区 */
import EditorBlocks from './EditorBlocks.vue';
import { computed, inject, ref } from 'vue';
import {cloneDeep} from 'lodash'
const {modelValue} =defineProps({
  modelValue:{type:Object}
})
const emit = defineEmits(['update:modelValue'])

const config = inject('config');
const data = computed({
  get() {
    return modelValue
  },
  set(newValue) {
    emit('update:modelValue',cloneDeep(newValue))
  }
})
// 获取data.json中的样式
const containerStyles = computed(()=>({
  width:`${data.value.container.width}px`,
  height:`${data.value.container.height}px`,
}))

const containerRef = ref(null)
// 拖拽相关
/*
1. dragenter 进入元素 增加移动标识
2. dragover 经过目标元素，必须阻止默认行为，否则无法触发drop
3. dragleave 离开元素 增加禁用标识
4. drop 松手时 根据拖拽组件放置组件
 */
// 增设当前拖动元素
let currentComponent = null
const dragenter = (e)=>{
  // 增设图标
  e.dataTransfer.dropEffect = 'move'
}
const  dragover = (e)=>{
  e.preventDefault();
}
const dragleave = (e)=>{
  // 增设离开图标
  e.dataTransfer.dropEffect = 'none'
}
const drop = (e)=>{
  // 内部原有数据
  let pre = data.value
  data.value = {
    ...pre,
    blocks:{
      top:e.offsetY,
      left:e.offsetX,
      zIndex:1,
      key:currentComponent.key
    }
  }
  
  currentComponent = null
}

// ---
const dragStart = (e,component)=>{
  containerRef.value.addEventListener('dragenter',dragenter)
  containerRef.value.addEventListener('dragover',dragover)
  containerRef.value.addEventListener('dragleave',dragleave)
  containerRef.value.addEventListener('drop',drop)
  currentComponent = component
}





</script>



<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  &-left,&-right {
    position: absolute;
    width: 270px;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: red;
  }
  &-left {
    left: 0;
    &-item {
      width: 250px;
      margin: 20px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      cursor: move;
      user-select: none;
      min-height: 90px;
      position: relative;
      > span {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgb(174, 177, 215);
        padding: 4px;
        color: #fff;
        // font-weight: 700;
      }
      &::after {
        content:'';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #ccc;
        opacity: 0.2;
        bottom: 0;


      }
    }
  }
  &-right {
    right: 0;
  }
  &-top {
    position: absolute;
    right: 280px;
    left: 280px;
    height: 80px;
    background-color: blue;
  }
  &-container {
    padding: 80px 270px 0;
    margin: auto;

    height: calc(100% - 80px);
    &-canvas {
      overflow: scroll;
      height: 100%;
      &-content {
        position: relative;
        margin:  auto;
        background-color: yellow;
        .editor-block {
          position: absolute;
        }
      }
    }
  }
}
</style>
