<template>
    <div class="editor-block" :style="blockStyle">
        <component :is="renderComponent"></component>
    </div>
</template>

<script setup>
/* 单个物料组件 */
import {computed, inject, render} from "vue"
const {block} = defineProps({
    block:{type:Object}
})

const config = inject('config')

// 从组件利用映射拿到对应组件
const component = config.componentMap[block.key]
console.log(render);

console.log(component.render());

const renderComponent = component.render()

const blockStyle = computed(()=>({
    top:`${block.top}px`,
    left:`${block.left}px`,
    zIndex:block.zIndex
}));
</script>

<style lang="scss" scoped>

</style>