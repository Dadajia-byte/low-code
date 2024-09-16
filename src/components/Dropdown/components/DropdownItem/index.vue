<template>
    <div class="dropdown-item" @click="hide">
        <i :class="icon" class="iconfont"></i>
        <span>{{ label }}</span>
    </div>
</template>

<script setup>
const { label, icon } = defineProps({
    label: String,
    icon: String,
})
const hide = inject('hide')


</script>

<style lang="scss" scoped>
.dropdown-item {
    line-height: 30px;
    width: 100px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
}
</style>