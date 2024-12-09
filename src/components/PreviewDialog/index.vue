<template>
  <ElDialog v-model="state.isShow">
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
            :class="{
              'editor-block-focus': item.focus,
              'editor-block-preview': previewRef,
            }"
            :block="item"
            @mousedown="(e) => blockMouseDown(e, item, index)"
            @contextmenu.stop.prevent="(e) => onContextBlock(e, item)"
            :formData="EditorDataStore.formData"
          >
          </EditorBlocks>
          <EditorBlocks
            v-for="item in EditorDataStore.data.blocks"
            :key="item.id"
            :block="item"
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
import { useEditorDataStore } from "@/store/index.js";
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
});
// 取消
const onCancel = () => {
  state.isShow = false;
};
// 确定,
const onConfirm = () => {
  state.isShow = false;
};

function showDialog() {
  state.isShow = true;
  state.option = option;
}

defineExpose({
  showDialog,
});
</script>

<style scoped lang="scss">
@import "@/styles/mixin.scss";
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;

  &-left,
  &-right {
    position: absolute;
    top: 0.4286rem;
    bottom: 0;
    height: 100%;
  }

  &-left {
    left: 0.0714rem;
    border-radius: 0.2857rem;
    width: 4.2857rem;
    border: #e3e3e3 0.0143rem solid;
    background-color: #fff;
    height: calc(100% - 1.4286rem);
    box-shadow: 0.0714rem 0.0571rem 0.1143rem rgba(0, 0, 0, 0.15);
    transition: all 0.5s;

    &-title {
      display: flex;
      margin-left: 0.5rem;
      margin-top: 0.2857rem;
      font-size: 0.3143rem;
    }

    &-search {
      margin-left: 0.2857rem;
      width: 90%;
    }

    &-menu {
      margin-left: 0.4143rem;
      width: 89%;
      margin-top: 0.1429rem;
      overflow-y: auto;
      height: 85%;
      padding-right: 0.0571rem;
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
        margin-top: 0.0714rem;
        margin-right: 0.0714rem;
        // border-bottom: #e0dfff .0143rem solid;
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
        min-height: 0.5714rem;
        position: relative;
        border-radius: 0.0714rem;
        border: 0.0143rem dashed #6965db;
        padding: 0 0.0571rem;

        &-label {
          font-size: 0.1714rem;
          color: #7d7d7d;
          width: 100%;
          text-align: center;
        }

        &:hover {
          border: 0.0143rem solid #6965db;
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
      @include out-z-index;
      position: absolute;
      right: 0.1429rem;
      top: 0.2857rem;
      border: #e3e3e3 0.0143rem solid;
      border-radius: 0.2143rem;
      height: 0.4286rem;
      width: 0.4286rem;
      box-shadow: 0.0286rem 0.0286rem 0.0714rem rgba(0, 0, 0, 0.15);
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
    right: -4.4286rem;
  }

  &-container {
    padding: 0.5714rem 2.8571rem 0;
    height: 95%;
    margin-bottom: 0.5714rem;
    box-sizing: border-box;
    border: #e3e3e3 0.0143rem solid;
    &-canvas {
      height: 100%;
      overflow: scroll;

      &-content {
        margin: 0.5714rem auto;
        // background-color: #f1f1f1;
        position: relative;
        border-radius: 0.5714rem;
        border: #e3e3e3 0.0286rem dashed;
      }
    }
  }
}

.editor-block {
  position: absolute;
}
</style>
