<template>
  <ElDialog v-model="state.isShow" :title="预览">
    <template v-slot:default>
      <div class="editor-container-canvas">
        <!-- 产生内容区域 -->
        <div
          class="editor-container-canvas-content"
          ref="containerRef"
          :style="containerStyles"
        >
        <EditorBlocks 
              v-for="(item, index) in state.blockData" 
              :key="item.id" 
              :class="{ 'editor-block-focus': item.focus, 'editor-block-preview': previewRef }"
              :block="item" @mousedown="(e) => blockMouseDown(e, item, index)"
              @contextmenu.stop.prevent="(e) => onContextBlock(e, item)"
              :formData="EditorDataStore.formData"
              >
            </EditorBlocks>
        </div>
      </div>
    </template>

    <!-- 底部插槽内容 -->
    <template v-slot:footer v-if="state.option.footer">
      <ElButton @click="onCancel">取消</ElButton>
      <ElButton type="primary" @click="onConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup>
import EditorBlocks from "../../packages/EditorBlocks/index.vue";
import { useEditorDataStore } from "../../store/module/editorData";
const EditorDataStore = useEditorDataStore();
const props = defineProps({
  option: { type: Object },
});
const containerStyles = computed(() => ({
  width: `${EditorDataStore.data.container.width}px`,
  height: `${EditorDataStore.data.container.height}px`,
}));
const state = reactive({
  isShow: false,
  option: props.option, // 用户给组件的属性
  blockData:props.data,
  canvasData:props.canvas,
  formData:props.formData
});
// 取消
const onCancel = () => {
  state.isShow = false;
};
// 确定,
const onConfirm = () => {
  state.isShow = false;
};
function showDialog(option) {
  state.isShow = true;
}

defineExpose({
  showDialog,
});
</script>

<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;

  &-left,
  &-right {
    position: absolute;
    top: 30px;
    bottom: 0;
    height: 100%;
  }

  &-left {
    left: 5px;
    border-radius: 20px;
    width: 300px;
    border: #e3e3e3 1px solid;
    background-color: #fff;
    height: 800px;
    height: calc(100% - 100px);
    box-shadow: 5px 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.5s;
    &-title {
      display: flex;
      margin-left: 35px;
      margin-top: 20px;
      font-size: 22px;
    }
    &-search {
      margin-left: 20px;
      width: 90%;
    }
    &-menu {
      margin-left: 29px;
      width: 89%;
      margin-top: 10px;
      overflow-y: auto;
      height: 85%;
      padding-right: 4px;
      scrollbar-gutter: stable;
    }
    &-menu-content {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;

      &-row {
        width: 48%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
        margin-right: 5px;
        // border-bottom: #e0dfff 1px solid;
      }
      &-item {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        box-sizing: border-box;
        cursor: move;
        user-select: none;
        min-height: 40px;
        position: relative;
        border-radius: 5px;
        border: 1px dashed #6965db;
        padding: 0 4px;

        &-label {
          font-size: 12px;
          color: #7d7d7d;
          width: 100%;
          text-align: center;
        }
        &:hover {
          border: 1px solid #6965db;
        }

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          // background-color: #ccc;
          opacity: 0.2;
          bottom: 0;
        }
      }
    }

    &-expand {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      position: absolute;
      right: 10px;
      top: 20px;
      border: #e3e3e3 1px solid;
      border-radius: 15px;
      height: 30px;
      width: 30px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      transition: transform 0.8s;
      cursor: pointer;
      &:hover {
        background-color: #e0dfff;
        color: white;
      }
    }
  }

  &-right {
    right: -310px;
  }

  &-container {
    padding: 40px 200px 0;
    height: 95%;
    margin-bottom: 40px;
    box-sizing: border-box;
    border: #e3e3e3 1px solid;
    z-index: 1;

    &-canvas {
      height: 100%;
      overflow: scroll;
      
      &-content {
        margin: 40px auto;
        // background-color: #f1f1f1;
        position: relative;
        border-radius: 40px;
      border: #e3e3e3 2px dashed;
      }
    }
  }
}

.editor-block {
  position: absolute;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.editor-block-focus {
  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 2px;
    border: 1px solid #6965db;
  }
}

.editor-block-preview {
  &::after {
    display: none;
  }
}

.line-x {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed #6965db;
}

.line-y {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #6965db;
}
</style>
