<template>
  <div class="editor">
    <!-- 左侧物料堆 -->
    <div class="editor-left">
      <div draggable="true" @dragstart="(e) => dragStart(e, item)" @dragend="(e) => dragEnd(e, item)"
        class="editor-left-item" v-for="(item, index) in config.componentList" :key="index">
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
        <div class="editor-container-canvas-content" ref="containerRef" :style="containerStyles"
          @mousedown="containerMouseDown">
          <div v-for="(item, index) in data.blocks" :key="index">
            <EditorBlocks :class="item.focus ? 'editor-block-focus' : 'editor-block'" :block="item"
              @mousedown="(e) => blockMouseDown(e, item)">
            </EditorBlocks>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* 编辑区 */
import EditorBlocks from './EditorBlocks.vue';
import { computed, inject, ref, watch } from 'vue';
import { cloneDeep } from 'lodash'
import useMenuDragger from '../utils/useMenuDragger';
import { useFocus } from '../utils/useFocus';
import { useBlockDragger } from '../utils/useBlockDragger';
const { modelValue } = defineProps({
  modelValue: { type: Object }
})
const emit = defineEmits(['update:modelValue'])

const config = inject('config');
const data = computed({
  get() {
    return modelValue
  },
  set(newValue) {
    emit('update:modelValue', cloneDeep(newValue))
  }
})
// 获取data.json中的样式
const containerStyles = computed(() => ({
  width: `${data.value.container.width}px`,
  height: `${data.value.container.height}px`,
}))

const containerRef = ref(null)

// 1. 实现物料堆拖拽
const { dragStart, dragEnd } = useMenuDragger(containerRef, data)



// 获取焦点后即可直接拖拽
let { blockMouseDown, focusData, containerMouseDown } = useFocus(data, (e) => {
  mousedown(e);
});

// 2. 实现组件拖拽
let { mousedown } = useBlockDragger(focusData)



</script>



<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &-left,
  &-right {
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

      >span {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgb(174, 177, 215);
        padding: 4px;
        color: #fff;
        // font-weight: 700;
      }

      &::after {
        content: '';
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
    margin: 20px auto;
    width: 60%;
    height: calc(100% - 80px);

    &-canvas {
      overflow: scroll;
      height: 100%;


      &-content {
        position: relative;

        margin: auto;
        background-color: yellow;

      }
    }
  }
}

.editor-block {
  position: absolute;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

}

.editor-block-focus {
  &::after {
    content: '';
    border: 2px dashed red;
  }

}
</style>
