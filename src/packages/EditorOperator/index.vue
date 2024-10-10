<template>
    <el-form labelPosition="top" class="editor-operator" >
            <div class="container-operator" :style="{left:props.block?'300px':'-20px'}">
                <el-text class="mx-1" size="large" style="margin-left: 5px;">容器配置</el-text>
                <el-divider />
                <div class="container-operator-content">

                    <el-form-item label="容器宽度">
                        <el-input-number v-model="state.editData.width"></el-input-number>
                    </el-form-item>
                    <el-form-item label="容器高度">
                        <el-input-number v-model="state.editData.height"></el-input-number>
                    </el-form-item>
                    <el-form-item >
                        <el-button color="#626aef" @click="() => apply()">应用</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </div>

            </div>
            <div class="block-operator" :style="{left:props.block?'-300px':'300px'}">
                <el-text class="mx-1" size="large" style="margin-left: 5px;">{{config.componentMap[props.block?.key]?.label}}</el-text>
                <el-divider style="margin-bottom: 5px;margin-top: 10px;"/>
                <div class="custom-style">
                    <el-segmented v-model="value" :options="options" />
                </div>
                <div class="block-operator-content">
                    <el-form-item :label="propConfig.label" v-for="(propConfig, propName) in componentProps" :key="propName">
                        <el-input v-if="propConfig.type === 'input'" v-model="state.editData.props[propName]"></el-input>
                        <el-color-picker v-if="propConfig.type === 'color'"
                            v-model="state.editData.props[propName]"></el-color-picker>
                        <el-select v-if="propConfig.type === 'select'" v-model="state.editData.props[propName]">
                            <el-option v-for="(item, index) in propConfig.options" :key="index" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <TableEditor 
                            v-if="propConfig.type === 'table'"
                            :propConfig="propConfig"
                            v-model="state.editData.props[propName]"  
                        ></TableEditor>
                    </el-form-item>
                    <template v-if="componentModel">
                        <el-form-item 
                            v-for="(label,modelName) in componentModel" 
                            :key="label" 
                            :label="label"
                        >
                            <el-input v-model="state.editData.model[modelName]"></el-input>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-button color="#626aef" @click="() => apply()">应用</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
    </el-form>
</template>

<script setup>
import { cloneDeep } from 'lodash'
import TableEditor from './TableEditor/index.vue'
const config = inject('config');

const props = defineProps({
    block: { type: Object },
    data: { type: Object },
    updateContainer: { type: Function },
    updateBlock: { type: Function }
})
const componentProps = computed(() => {
    if (props.block) {
        return config.componentMap[props.block.key].props;
    }
    return {};
});
const componentModel = computed(() => {
    if (props.block) {   
        return config.componentMap[props.block.key].model;
    }
    return {};
})

const state = reactive({
    editData: {}
})
const reset = () => {
    // 重置表单
    if (!props.block) { // 绑定的是容器的宽度和高度
        
         state.editData = cloneDeep(props.data.container);

    } else {
        state.editData = cloneDeep(props.block)
    }
}
const apply = () => {
    // 应用
    if (!props.block) { // 绑定的是组件的配置
    
        props.updateContainer({ ...props.data, container: state.editData })
    } else {
        props.updateBlock(state.editData, props.block)
    }
}
watch(() => props.block, reset, { immediate: true })

const value = ref('属性')

const options = ['属性', '动画', '事件']


</script>

<style lang="scss" scoped>
.editor-operator {
    display: flex;
    .container-operator,
    .block-operator {
        position: relative;
        min-height: 800px;
        width: 210px;
        left: 0;
        padding-left: 30px;
        padding-top: 30px;
        padding-right: 20px;
        background-color: white;
        border-radius: 40px 0 0 40px;
        border: #e3e3e3 1px solid;
        box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.15);
        transition: all .5s;
    }
    .container-operator {
        
        &-content {
            margin-left: 10px;
        }
    }
    .block-operator {
        &-content {
            margin: 20px 15px;
        }
        .custom-style .el-segmented {
            width: 210px;
            --el-segmented-item-selected-color: white;
            --el-segmented-item-selected-bg-color: #6965db;
            --el-border-radius-base: 24px;
        }
    }
}



</style>