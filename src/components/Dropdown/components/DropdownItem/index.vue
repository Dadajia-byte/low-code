<template>
    <div>
        <div class="dropdown-item" @click="hide">
            <div>{{ label }}</div>
            <div class="shortCut">{{ shortCut }}</div>
        </div>
        <el-divider v-if="divider" style="margin-top: 5px;margin-bottom: 5px;"></el-divider>
    </div>
</template>

<script setup>
const { label,shortCut,divider } = defineProps({
    label: String,
    shortCut: String,
    divider:Boolean,
})
const hide = inject('hide')


</script>

<style lang="scss" scoped>
.dropdown-item {
    display: flex;
    justify-content: space-between;
    padding: 0px 12px;
    line-height: 22px;
    margin-top: 5px;
    text-align: center;
    font-size: 14px;
    font-family:'Times New Roman', Times, serif;
    cursor: pointer;
    .shortCut {
        color: #717273;
        font-size: 12px;

    }
    &:hover {
        background-color: #6965db;
        color: white;
        .shortCut {
            color: white;
        }
    }
}
</style>