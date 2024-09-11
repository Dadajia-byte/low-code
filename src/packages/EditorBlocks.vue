<template>
    <div class="editor-block" ref="blockRef" :style="blockStyle">
        <component :is="renderComponent"></component>
    </div>
</template>

<script setup>
/* 单个物料组件 */
import { computed, inject, onMounted, ref, render } from "vue"
const { block } = defineProps({
    block: { type: Object }
})

const config = inject('config')

// 从组件利用映射拿到对应组件
const component = config.componentMap[block.key]
const blockRef = ref(null)
onMounted(() => {
    let { offsetWidth, offsetHeight } = blockRef.value
    if (block.alignCenter) { // 说明是拖拽松手时才渲染，其他的默认渲染到页面上的内容不需要居中
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.alignCenter = false; // 让渲染后结果才能居中
    }
    block.width = offsetWidth;
    block.height = offsetHeight;
})
const renderComponent = component.render()

const blockStyle = computed(() => ({
    top: `${block.top}px`,
    left: `${block.left}px`,
    zIndex: block.zIndex
}));
</script>

<style lang="scss" scoped></style>