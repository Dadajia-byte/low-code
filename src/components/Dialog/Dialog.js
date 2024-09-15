import { createVNode, render } from "vue";
import DialogComponent from "./DialogComponent.vue"; // 引入模板形式的组件

let VNode;
export function $dialog(option) {
  // 创建一个挂载点
  // 手动挂载组件
  if (!VNode) {
    // 不重复创建
    let el = document.createElement("div");
    // 渲染成虚拟节点
    VNode = createVNode(DialogComponent, { option });
    // 将虚拟节点挂载到页面的真实 DOM 中
    render(VNode, el);
    document.body.appendChild(el);
  }
  // 获取暴露的方法并调用
  let { showDialog } = VNode.component.exposed;
  showDialog(option);
}
