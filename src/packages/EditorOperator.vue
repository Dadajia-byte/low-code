<template>
    <el-form labelPosition="top" style="padding:30px">
        <template v-if="!block">
            <el-form-item label="容器宽度">
                <el-input-number></el-input-number>
            </el-form-item>
            <el-form-item label="容器高度">
                <el-input-number></el-input-number>
            </el-form-item>
        </template>

        <template v-else>
            <template v-for="(propConfig, propName) in componentProps" :key="propName">
                <el-form-item :label="propConfig.label">
                    <el-input v-if="propConfig.type === 'input'"></el-input>
                    <el-color-picker v-if="propConfig.type === 'color'"></el-color-picker>
                    <el-select v-if="propConfig.type === 'select'">
                        <el-option v-for="(item, index) in propConfig.options" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </template>
        <el-form-item>
            <el-button type="primary">应用</el-button>
            <el-button>重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
const { block, data } = defineProps({
    block: { type: Object },
    data: { type: Object }
})
const config = inject('config')
const componentProps = computed(() => {
    if (block) {
        let component = config.componentMap[block.key];
        return component && component.props ? component.props : {};
    }
    return {};
});
</script>

<style lang="scss" scoped></style>