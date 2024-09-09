import { ElButton, ElInput } from "element-plus";
import { h } from "vue";
/*
 *列表区可以显示所有物料，key对应所有组件的映射关系
 */

function createEditorConfig() {
  // 物料列表
  const componentList = [];
  const componentMap = {};
  const register = (component) => {
    componentList.push(component);
    componentMap[component.key] = component;
  };
  return {
    register,
    componentList,
    componentMap,
  };
}

export let registerConfig = createEditorConfig();

registerConfig.register({
  label: "预览文本",
  preview: () => "我是预览文本",
  render: () => h("div", {}, "渲染文本"),
  key: "text",
});
registerConfig.register({
  label: "按钮",
  preview: () => h(ElButton, {}, "我是预览按钮"),
  render: () => h(ElButton, {}, "渲染按钮"),
  key: "button",
});
registerConfig.register({
  label: "输入框",
  preview: () => h(ElInput, { placeholder: "请输入内容" }, "我是预览输入框"),
  render: () => h(ElInput, { placeholder: "请输入内容" }, "渲染输入框"),
  key: "input",
});
