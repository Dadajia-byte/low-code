<template>
    <el-form labelPosition="top" style="padding:50px">
        <template v-if="!props.block">
            <el-form-item label="容器宽度">
                <el-input-number v-model="state.editData.width"></el-input-number>
            </el-form-item>
            <el-form-item label="容器高度">
                <el-input-number v-model="state.editData.height"></el-input-number>
            </el-form-item>
        </template>
        <template v-else>
            <template v-for="(propConfig, propName) in componentProps" :key="propName">
                <el-form-item :label="propConfig.label">
                    <el-input v-if="propConfig.type === 'input'" v-model="state.editData.props[propName]"></el-input>
                    <el-color-picker v-if="propConfig.type === 'color'"
                        v-model="state.editData.props[propName]"></el-color-picker>
                    <el-select v-if="propConfig.type === 'select'" v-model="state.editData.props[propName]">
                        <el-option v-for="(item, index) in propConfig.options" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </template>
        <el-form-item>
            <el-button type="primary" @click="() => apply()">应用</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { cloneDeep } from 'lodash'
const props = defineProps({
    block: { type: Object },
    data: { type: Object },
    updateContainer: { type: Function },
    updateBlock: { type: Function }
})
const config = inject('config')
const componentProps = computed(() => {
    if (props.block) {
        let component = config.componentMap[props.block.key];
        return component.props;
    }
    return {};
});
const state = reactive({
    editData: {}
})
const reset = () => {
    // 重置表单
    if (!props.block) { // 绑定的是容器的宽度和高度
        state.editData = cloneDeep(props.data.container)
    } else {
        state.editData = cloneDeep(props.block)
    }
}
const apply = () => {
    // 应用
    if (!props.block) { // 绑定的是组件的配置
        props.updateContainer({ ...props.data, container: state.editData })
    } else {
        let newId = String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))
        props.updateBlock({ ...state.editData, id: newId }, props.block)
    }
}
watch(() => props.block, reset, { immediate: true })
</script>

<style lang="scss" scoped></style>