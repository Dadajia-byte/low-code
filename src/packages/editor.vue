<template>
  <div class="editor">
    <!-- 左侧物料堆 -->
    <div class="editor-left">
      <div draggable="true" @dragstart="e => dragStart(e, item)" @dragend="e => dragEnd(e, item)"
        class="editor-left-item" v-for="(item, index) in config.componentList" :key="index">
        <span>{{ item.label }}</span>
        <component :is="item.preview"></component>
      </div>
    </div>
    <!-- 顶部菜单栏 -->
    <div class="editor-top">
      <div v-for="(btn, index) in buttons" :key="index" @click="btn.handler" class="editor-top-button">
        <i :class="btn.icon" class="iconfont"></i>
        <span>{{ btn.label }}</span>
      </div>
    </div>
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
              @mousedown="(e) => blockMouseDown(e, item, index)">
            </EditorBlocks>
          </div>
          <!-- 辅助线 -->
          <div v-show="markline.x" class="line-x" :style="{ left: markline.x + 'px' }"></div>
          <div v-show="markline.y" class="line-y" :style="{ top: markline.y + 'px' }"></div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup>
/* 编辑区 */
import EditorBlocks from './EditorBlocks.vue';
import { computed, inject, onMounted, ref } from 'vue';
import { cloneDeep } from 'lodash'
import useMenuDragger from '../utils/useMenuDragger';
import { useFocus } from '../utils/useFocus';
import { useBlockDragger } from '../utils/useBlockDragger';
import { useCommand } from '../utils/useCommand';
const { modelValue } = defineProps({
  modelValue: { type: Object }
})
import { $dialog } from '../components/Dialog/Dialog';
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

// 2.获取焦点后即可直接拖拽
let { blockMouseDown, focusData, containerMouseDown, lastSelectBlock } = useFocus(data, (e) => {
  mousedown(e);
});

// 3. 实现组件拖拽
let { mousedown, markline } = useBlockDragger(focusData, lastSelectBlock, data)

// 用于保存可能使用的所有指令(操作)
const { commands } = useCommand(data);

// 所有可能使用的按钮
const buttons = [
  { label: '撤销', icon: 'icon-chehui', handler: commands.undo },
  { label: '重做', icon: 'icon-zhongzuo', handler: commands.redo },
  {
    label: '导出', icon: 'icon-daochu', handler: () => {
      $dialog({
        title: '导出JSON',
        content: JSON.stringify(data.value)
      })
    },
  },
  {
    label: '导入', icon: 'icon-daoru', handler: () => {
      $dialog({
        title: '导入JSON',
        footer: true,
        onConfirm(text) {
          // data.value = JSON.parse(text); // 这样更改无法实现撤销和重做
          commands.updateContainer(JSON.parse(text))
        }
      })
    },
  },
  {
    label: '置顶', icon: 'icon-jichu_zhiding'
  },
  {
    label: '置底', icon: 'icon-jichu_zhidi'
  }
]


onMounted(() => {
  console.log(commands);

})
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
    display: flex;
    justify-content: center;
    align-items: center;

    &-button {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background-color: rgba(0, 0, 0, .3);
      user-select: none;
      cursor: pointer;
      color: #fff;

      .iconfont {
        font-size: 28px;
      }

      span {
        font-size: 12px;
      }

      &+& {
        margin-left: 3px;
      }
    }

  }

  &-container {
    padding: 80px 270px 0;
    height: 100%;
    box-sizing: border-box;

    &-canvas {
      height: 100%;
      overflow: scroll;

      &-content {
        margin: 20px auto;
        background-color: yellow;
        position: relative;
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

.line-x {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed red;
}

.line-y {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed red;
}
</style>
