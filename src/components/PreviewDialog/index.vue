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
function showDialog(option) {
  state.isShow = true;
  state.option = option;
}

defineExpose({
  showDialog,
});
</script>

<style scoped lang="scss">
.editor-container-canvas {
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

.editor-block {
  position: absolute;
}
</style>
