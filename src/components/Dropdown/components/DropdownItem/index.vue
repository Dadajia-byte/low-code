<template>
  <div>
    <div :class="{ 'dropdown-item-disabled': disabled ,'dropdown-item':!disabled}" @click="hide">
      <div>{{ label }}</div>
      <div class="shortCut">{{ shortCut }}</div>
    </div>
    <el-divider v-if="divider" style="margin-top: .0714rem;margin-bottom: .0714rem;"></el-divider>
  </div>
</template>

<script setup>
const {label, shortCut, divider, disabled} = defineProps({
  label: String,
  shortCut: String,
  divider: Boolean,
  disabled: Boolean
})
const hide = inject('hide')

</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 0rem .1714rem;
  line-height: .3143rem;
  margin-top: .0714rem;
  text-align: center;
  font-size: .2rem;
  font-family: 'Times New Roman', Times, serif;
  cursor: pointer;

  .shortCut {
    color: #717273;
    font-size: .1714rem;

  }

  &:hover {
    background-color: #6965db;
    color: white;

    .shortCut {
      color: white;
    }
  }
}

.dropdown-item-disabled {
  display: flex;
  justify-content: space-between;
  padding: 0rem .1714rem;
  line-height: .3143rem;
  margin-top: .0714rem;
  text-align: center;
  font-size: .2rem;
  color: #717273;
  font-family: 'Times New Roman', Times, serif;
}
</style>