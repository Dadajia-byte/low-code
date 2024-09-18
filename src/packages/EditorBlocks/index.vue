<template>
    <div class="editor-block" ref="blockRef" :style="blockStyle">
        <component :is="renderComponent"></component>
    </div>
</template>

<script setup>

import { onMounted } from 'vue';

/* 单个物料组件 */
const props = defineProps({
    block: { type: Object },
    formData:{type:Object}
})

const config = inject('config')

// 从组件利用映射拿到对应组件
const component = config.componentMap[props.block.key]
console.log(component);

const blockRef = ref(null);

const renderComponent = component.render({
    props: props.block.props,
    model: Object.keys(component.model||{}).reduce((pre,modelName)=>{
        let propName = props.block.model[modelName];
        console.log(propName);
        
        pre[modelName] = {
            modelValue:props.formData[propName],
            "onUpdate:modelValue":v=>props.formData[propName] = v
        }
        return pre;
    },{})
})

onMounted(() => {
    let { offsetWidth, offsetHeight } = blockRef.value
    if (props.block.alignCenter) { // 说明是拖拽松手时才渲染，其他的默认渲染到页面上的内容不需要居中
        props.block.left = props.block.left - offsetWidth / 2;
        props.block.top = props.block.top - offsetHeight / 2;
        props.block.alignCenter = false; // 让渲染后结果才能居中
    }
    props.block.width = offsetWidth;
    props.block.height = offsetHeight;
})
const blockStyle = computed(() => ({
    top: `${props.block.top}px`,
    left: `${props.block.left}px`,
    zIndex: props.block.zIndex
}));
onMounted(() => {
    console.log('重新渲染了', props.block);

})
</script>

<style lang="scss" scoped></style>