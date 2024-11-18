<!-- src/components/AdvancedSearchBox.vue -->
<template>
  <div class="mySearch" :class="{ 'mySearch-active': showDropdown }">
    <el-input
      v-model="searchQuery"
      placeholder="请输入搜索内容"
      clearable
      @focus="showDropdown = true"
      @blur="showDropdown = false"
    >
      <template #prefix>
        <el-icon>
          <i-ep-Search />
        </el-icon>
      </template>
    </el-input>
    <div class="mySearch-items">
      <div class="mySearch-item">
        <div class="mySearch-item-prefix"></div>
        <div class="mySearch-item-content"></div>
        <div class="mySearch-item-suffix">
          <el-icon>
            <i-ep-Close />
          </el-icon>
        </div>
      </div>
    </div>

    <div class="mySearch-bottom" v-if="showDropdown"></div>
  </div>
</template>

<script setup>
const showDropdown = ref(false);
const searchQuery = ref("");
</script>

<style lang="scss" scoped>
.mySearch {
  width: 300px; // 暂时给个固定的宽度
  &-bottom {
    width: 100%;
    background-color: #fff;
  }

  &-item {
    margin: 0.2143rem;
    height: 0.4286rem;
    border-radius: 0.1429rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    &-suffix {
      cursor: pointer;
      color: rgb(144, 147, 153);
    }
    &:hover {
      background-color: rgb(87, 83, 208);
      color: #fff;
      &-suffix {
        color: #fff;
      }
    }
  }
}
.mySearch-active {
  background-color: #f8f8f8;
  box-shadow: 5px 5px 5px rgba($color: #000000, $alpha: 0.15);
}
</style>
