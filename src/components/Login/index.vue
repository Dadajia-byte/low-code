<template>
    <ElDialog v-model="state.isShow" width="480px" class="custom1-color contanier" style="overflow: hidden;padding: 16px 0;">
        <div class="carousel">
            <!-- 轮播，但是依靠队列实现，记录上一个 和 当前的索引 以及 下一个，实现切换效果 -->
             <transition-group name="carousel" tag="div" class="carousel-wrapper">
            </transition-group>
            <Login :login="state.login" :hide="methods.hide" :index="0"></Login>
            <Login :login="state.login" :index="1"></Login>
        </div>

       
    </ElDialog>
</template>

<script setup>
import Login from "./Login.vue"
const {option} = defineProps({
    option:{type:Object}
})

const state = reactive({
    isShow: false,
    option: option, // 用户给组件的属性
    login:{
        email: "",
        password: "",
    }
});
const methods = {
    show(option) {
        state.isShow = true;
        state.option = option;
    },
    hide() {
        state.isShow = false;
    }
}

defineExpose(methods)


</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
    
}
.carousel {
    display: flex;
    flex-wrap: nowrap;
    width: 960px;
    transition: all .5s;
}
</style>