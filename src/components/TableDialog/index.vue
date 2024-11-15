<template>
  <ElDialog v-model="state.isShow" :title="state.option.config.label || '请添加标题'">
    <template v-slot:default>
      <div>
        <el-button @click="add" color="#626aef">添加</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <el-table :data="state.editData">
        <el-table-column type="index"></el-table-column>
        <el-table-column
            align="center"
            v-for="(item, index) in state.option.config.table.options"
            :label="item.label"
        >
          <template #default="{ row }">
            <el-input v-model="row[item.field]"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{  $index }">
            <el-button type="danger" @click="deleteItem($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:footer>
      <el-button @click="state.isShow = false">取消</el-button>
      <el-button color="#626aef" @click="onConfirm">确定</el-button>
    </template>
  </ElDialog>
</template>

<script setup>
import {reactive} from "vue";
import {cloneDeep} from "lodash";

const {option} = defineProps({
  option: {type: Object},
});
const state = reactive({
  option: option,
  isShow: false,
  editData: [], // 编辑的数据
});

const methods = {
  show(option) {
    state.option = option; // 保存用户的配置
    state.isShow = true; // 更改显示状态
    state.editData = cloneDeep(option.data); // 通过渲染的数据默认展现
  },
};
const add = () => {
  state.editData.push({});
};
const reset = () => {
  state.editData = [];
};
const deleteItem = (index) => {

  state.editData.splice(index, 1)
};
const onConfirm = () => {
  state.isShow = false;
  // 触发事件
  state.option.onConfirm(state.editData);
};

defineExpose(methods);
</script>

<style lang="scss" scoped></style>
