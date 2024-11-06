<template>
    <div class="editor-top" :style="{ top: isExpanded ? '-0.8571rem' : '.1429rem' }">
      <div v-for="(btn, index) in buttons" :key="index" @click="btn.handler" class="editor-top-button">
        <i :class="typeof btn.icon == 'function' ? btn.icon() : btn.icon" class="iconfont"></i>
        <!-- <span>{{ typeof btn.label == 'function' ? btn.label() : btn.label }}</span> -->
      </div>
      <div class="editor-top-expand" @click="toggleExpand">
        <el-icon :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }" style="font-size: .3143rem; transition: transform 0.5s;"><i-ep-CaretTop /></el-icon>
      </div>
    </div>
</template>

<script setup>
const {buttons} = defineProps({
    buttons: {type:Array}
})

const isExpanded = ref(false)
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss" scoped>
.editor-top {
    position: absolute;
    top: .1429rem;
    left: 50%;
    translate: -50%;
    height: .8571rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: .2857rem;
    width: fit-content;
    padding: 0 .5714rem;
    border: #e3e3e3 .0143rem solid;
    box-shadow: .0857rem .0571rem .1429rem rgba(0, 0, 0, 0.1);
    transition: all .5s;
    z-index: 999;

    &-button {
        width: .7143rem;
        height: .7143rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        user-select: none;
        cursor: pointer;
        color: black;
        border-radius: .1429rem;
        &:hover {
        background-color: #f1f0ff;
        }
        
        .iconfont {
        font-size: .3429rem;
        color: #606266;
        }

        span {
        font-size: .1714rem;
        }

        &+& {
        margin-left: .0429rem;
        }
    }
    &-expand {
        z-index: 99999;
        position: absolute;
        background-color: white;
        top: .7143rem;
        border: #e3e3e3 .0143rem solid;
        width: .4286rem;
        height: .4286rem;
        border-radius: .2143rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: .0286rem .0286rem .0714rem rgba(0, 0, 0, 0.15);
        &:hover {
        background-color: #e0dfff;
        color: white;
        }
    }

}
</style>