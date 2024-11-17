<template>
  <el-form labelPosition="top" class="editor-operator">
    <div
        class="container-operator"
        :style="{ left: props.block ? '4.2857rem' : '-0.2857rem' }"
    >
      <el-text class="mx-1" size="large" style="margin-left: 0.0714rem"
      >容器配置
      </el-text
      >
      <el-divider/>
      <div class="container-operator-content">
        <el-form-item label="容器宽度">
          <el-input-number v-model="state.editData.width"></el-input-number>
        </el-form-item>
        <el-form-item label="容器高度">
          <el-input-number v-model="state.editData.height"></el-input-number>
        </el-form-item>
        <el-form-item label="背景网格">
          <el-switch v-model="state.editData.grid"/>
        </el-form-item>
        <el-form-item>
          <el-button color="#626aef" @click="() => apply()">应用</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </div>
    <div
        class="block-operator"
        :style="{ left: props.block ? '-4.2857rem' : '4.2857rem' }"
    >
      <el-text class="mx-1" size="large" style="margin-left: 0.0714rem">{{
          config.componentMap[props.block?.key]?.label
        }}
      </el-text>
      <el-divider style="margin-bottom: 0.0714rem; margin-top: 0.1429rem"/>
      <div class="custom-style">
        <el-segmented v-model="value" :options="options"/>
      </div>
      <div class="block-operator-content">
        <el-form-item
            :label="propConfig.label"
            v-for="(propConfig, propName) in componentProps"
            :key="propName"
        >
          <el-input
              v-if="propConfig.type === 'input'"
              v-model="state.editData.props[propName]"
          ></el-input>
          <el-color-picker
              v-if="propConfig.type === 'color'"
              v-model="state.editData.props[propName]"
          ></el-color-picker>
          <el-select
              v-if="propConfig.type === 'select'"
              v-model="state.editData.props[propName]"
          >
            <el-option
                v-for="(item, index) in propConfig.options"
                :key="index"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <TableEditor
              v-if="propConfig.type === 'table'"
              :propConfig="propConfig"
              v-model="state.editData.props[propName]"
          ></TableEditor>
        </el-form-item>
        <template v-if="componentModel">
          <el-form-item
              v-for="(label, modelName) in componentModel"
              :key="label"
              :label="label"
          >
            <el-input v-model="state.editData.model[modelName]"></el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button color="#626aef" @click="() => apply()">应用</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import {cloneDeep} from "lodash";
import TableEditor from "./TableEditor/index.vue";

const config = inject("config");

const props = defineProps({
  block: {type: Object},
  data: {type: Object},
  updateContainer: {type: Function},
  updateBlock: {type: Function},
});
const componentProps = computed(() => {
  if (props.block) {
    return config.componentMap[props.block.key].props;
  }
  return {};
});
const componentModel = computed(() => {
  if (props.block) {
    return config.componentMap[props.block.key].model;
  }
  return {};
});

const state = reactive({
  editData: {},
});
const reset = () => {
  // 重置表单
  if (!props.block) {
    // 绑定的是容器的宽度和高度

    state.editData = cloneDeep(props.data.container);
  } else {
    state.editData = cloneDeep(props.block);
  }
};
const apply = () => {
  // 应用
  if (!props.block) {
    // 绑定的是组件的配置

    props.updateContainer({...props.data, container: state.editData});
  } else {
    props.updateBlock(state.editData, props.block);
  }
};
watch(() => props.block, reset, {immediate: true});

const value = ref("属性");

const options = ["属性", "动画", "事件"];
</script>

<style lang="scss" scoped>
.editor-operator {
  display: flex;

  .container-operator,
  .block-operator {
    position: relative;
    min-height: 11.4286rem;
    width: 3rem;
    left: 0;
    padding-left: 0.4286rem;
    padding-top: 0.4286rem;
    padding-right: 0.2857rem;
    background-color: white;
    border-radius: 0.5714rem 0 0 0.5714rem;
    border: #e3e3e3 0.0143rem solid;
    box-shadow: 0.0143rem 0.0571rem 0.1429rem rgba(0, 0, 0, 0.15);
    transition: all 0.5s;
  }

  .container-operator {
    &-content {
      margin-left: 0.1429rem;
    }
  }

  .block-operator {
    &-content {
      margin: 0.2857rem 0.2143rem;
    }

    .custom-style .el-segmented {
      width: 3rem;
      --el-segmented-item-selected-color: white;
      --el-segmented-item-selected-bg-color: #6965db;
      --el-border-radius-base: 0.3429rem;
    }
  }
}
</style>
