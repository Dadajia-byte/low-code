<template>
    <ElDialog v-model="state.isShow" :title="state.option.config.label ||'请添加标题'">
        <template v-slot:default>
            <div>
                <el-button @click="add" type="primary">添加</el-button>
                <el-button>重置</el-button>
            </div>
            <el-table :data="state.editData">
                <el-table-column v-for="(item,index) in state.option.config.table.options" :label="item.label">
                    <template #default="{row}">
                        <el-input v-model="row[item.field]"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </template>    
    </ElDialog>
</template>

<script setup>
import { reactive } from 'vue';
import {cloneDeep} from 'lodash';
const {option}=defineProps({
    option:{type:Object}
})
const state = reactive({
    option:option,
    isShow:false,
    editData:[],// 编辑的数据
})
console.log(state.editData);

const methods= {
    show(option) {
        state.option = option; // 保存用户的配置
        state.isShow = true; // 更改显示状态
        state.editData = cloneDeep(option.data); // 通过渲染的数据默认展现
    }
}
const add= ()=>{
    state.editData.push({})
}
defineExpose(methods)
</script>

<style lang="scss" scoped>

</style>