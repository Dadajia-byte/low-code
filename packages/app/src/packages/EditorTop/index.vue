<template>
  <div
      class="editor-top"
      :style="{ top: isExpanded ? '-0.8571rem' : '.1429rem' }"
  >
    <div
        v-for="btn in buttons"
        :key="btn.label"
        @click="btn.handler"
        class="editor-top-button"
        :class="{ 'editor-top-button-active': isActive(btn) }"
    >
      <i
          :class="typeof btn.icon == 'function' ? btn.icon() : btn.icon"
          class="iconfont"
      ></i>
    </div>
    <div class="editor-top-expand" @click="toggleExpand">
      <el-icon
          :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }"
          style="font-size: 0.3143rem; transition: transform 0.5s"
      >
        <i-ep-CaretTop
        />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
const {buttons, editorOperatorStatus: status} = defineProps({
  buttons: {type: Array},
  editorOperatorStatus: {type: Boolean},
});

const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const isActive = (btn) => {
  return (status && btn.label === "鼠标") || (!status && btn.label === "抓手");
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.editor-top {
  position: absolute;
  top: 0.1429rem;
  left: 50%;
  transform: translateX(-50%);
  height: 0.8571rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 0.2857rem;
  width: fit-content;
  padding: 0 0.5714rem;
  border: #e3e3e3 0.0143rem solid;
  box-shadow: 0.0857rem 0.0571rem 0.1429rem rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  @include out-z-index;

  &-button,
  &-button-active {
    width: 0.7143rem;
    height: 0.7143rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: black;
    border-radius: 0.1429rem;

    &:hover {
      background-color: #f1f0ff;
    }

    .iconfont {
      font-size: 0.3429rem;
      color: #606266;
    }

    span {
      font-size: 0.1714rem;
    }

    & + & {
      margin-left: 0.0429rem;
    }
  }

  &-button-active {
    background-color: #f1f0ff;
  }

  &-expand {
    @include out-z-index;
    position: absolute;
    background-color: white;
    top: 0.7143rem;
    border: #e3e3e3 0.0143rem solid;
    width: 0.4286rem;
    height: 0.4286rem;
    border-radius: 0.2143rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0.0286rem 0.0286rem 0.0714rem rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: #e0dfff;
      color: white;
    }
  }
}
</style>
