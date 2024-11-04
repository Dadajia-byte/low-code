<template>
    <div class="editor-top" :style="{ top: isExpanded ? '-60px' : '10px' }">
      <div v-for="(btn, index) in buttons" :key="index" @click="btn.handler" class="editor-top-button">
        <i :class="typeof btn.icon == 'function' ? btn.icon() : btn.icon" class="iconfont"></i>
        <!-- <span>{{ typeof btn.label == 'function' ? btn.label() : btn.label }}</span> -->
      </div>
      <div class="editor-top-expand" @click="toggleExpand">
        <el-icon :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }" style="font-size: 22px; transition: transform 0.5s;"><i-ep-CaretTop /></el-icon>
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
    top: 10px;
    left: 50%;
    translate: -50%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    width: fit-content;
    padding: 0 40px;
    border: #e3e3e3 1px solid;
    box-shadow: 6px 4px 10px rgba(0, 0, 0, 0.1);
    transition: all .5s;
    z-index: 999;

    &-button {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        user-select: none;
        cursor: pointer;
        color: black;
        border-radius: 10px;
        &:hover {
        background-color: #f1f0ff;
        }
        
        .iconfont {
        font-size: 24px;
        color: #606266;
        }

        span {
        font-size: 12px;
        }

        &+& {
        margin-left: 3px;
        }
    }
    &-expand {
        z-index: 99999;
        position: absolute;
        background-color: white;
        top: 50px;
        border: #e3e3e3 1px solid;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
        &:hover {
        background-color: #e0dfff;
        color: white;
        }
    }

}
</style>