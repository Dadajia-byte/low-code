<template>
    <div class="editor-block" ref="blockRef" :style="blockStyle">
        <component :is="renderComponent" v-model="_value"></component>
        <BlockResize 
            v-if="props.block.focus && (width||height)" 
            :block="props.block"
            :component="component"
        ></BlockResize>
    </div>
</template>

<script setup>
import BlockResize from "./BlockResize/index.vue"

/* 单个物料组件 */
const props = defineProps({
    block: { type: Object },
    formData:{type:Object}
})

const config = inject('config')
// 从组件利用映射拿到对应组件
const component = config.componentMap[props.block.key];
const blockRef = ref(null);

console.log(props.block);

let propName = props.block.model[Object.keys(component.model)[0]]
const _value = computed({
    get: () => props.formData[propName],
    set: (v) => {
        props.formData[propName] = v;
    }
})

const renderComponent = component.render({
  props: props.block.props,
  size:props.block.hasResize ? {width:props.block.width,height:props.block.height} : {}
});
const blockStyle = computed(() => ({
    top: `${props.block.top}px`,
    left: `${props.block.left}px`,
    zIndex: props.block.zIndex
}));

const {width,height} = component.resize || {}



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

</script>

<style lang="scss" scoped></style>