<template>
    <ElDialog v-model="state.isShow" :title="state.option.title">
        <!-- 可以在这里添加对话框的内容 -->
        <template v-slot:default>
            <ElInput type="textarea" v-model="state.option.content"></ElInput>
        </template>

        <!-- 底部插槽内容 -->
        <template v-slot:footer v-if="state.option.footer">
            <ElButton @click="onCancel">取消</ElButton>
            <ElButton type="primary" @click="onConfirm">确定</ElButton>
        </template>
    </ElDialog>
</template>

<script setup>
import { ElDialog, ElInput, ElButton } from "element-plus";
import { reactive, defineExpose, defineProps } from "vue";

const props = defineProps({
    option: Object,
});

const state = reactive({
    isShow: false,
    option: props.option, // 用户给组件的属性
});
// 取消
const onCancel = () => {
    state.isShow = false;
}
// 确定,并应用json
const onConfirm = () => {
    state.isShow = false;
    state.option.onConfirm && state.option.onConfirm(state.option.content);
}
function showDialog(option) {
    state.option = option; // 更新每次调用的option；因为本质上使用的是单例模式，每次挂载的是同一个vnode，所以需要更新option
    state.isShow = true;
}

defineExpose({
    showDialog,
});
</script>
