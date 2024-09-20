<template>
    <template v-if="!data || data.length===0">
        <el-button @click="add">添加</el-button>
    </template>
</template>

<script setup>
import {cloneDeep} from 'lodash'
import {$tableDialog} from "@/components/TableDialog/index.js"
const {propConfig,modelValue} = defineProps({
    propConfig:{type:Object},
    modelValue:{type:Array}
})
const emit = defineEmits(['update:modelValue'])
const data = computed({
    get() {
        return modelValue || []
    },
    set(nv) {
        emit('update:modelValue',cloneDeep(nv))
    }
})
const add =()=>{
    $tableDialog({
        config:propConfig,
        data:data.value,
        onConfirm(value){
            data.value = value
        },
    })
}

</script>

<style lang="scss" scoped>

</style>