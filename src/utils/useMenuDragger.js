// 拖拽相关

import { events } from "./event";
import { useEditorDataStore } from "../store/module/editorData";
/*
1. dragenter 进入元素 增加移动标识
2. dragover 经过目标元素，必须阻止默认行为，否则无法触发drop
3. dragleave 离开元素 增加禁用标识
4. drop 松手时 根据拖拽组件放置组件
 */
export function useMenuDragger(containerRef, data) {
  // 引入Store
  const editorDataStore = useEditorDataStore();
  // 增设当前拖动元素
  let currentComponent = null;
  const dragenter = (e) => {
    // 增设图标
    e.dataTransfer.dropEffect = "move";
  };
  const dragover = (e) => {
    e.preventDefault();
  };
  const dragleave = (e) => {
    // 增设离开图标
    e.dataTransfer.dropEffect = "none";
  };
  const drop = (e) => {
    
   editorDataStore.data.blocks.push({
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true, // 希望松手的时候可以居中
          id:String(new Date().getTime()) + String(Math.floor(Math.random() * 1000)),// 这里用于生成id便于for的key，不然出现很多bug
          props:{},
          model:{}
        },)
    // let pre = data;
    // data = {
    //   ...pre,
    //   blocks: [
    //     ...pre.blocks,
    //     // 拖拽元素
    //     {
    //       top: e.offsetY,
    //       left: e.offsetX,
    //       zIndex: 1,
    //       key: currentComponent.key,
    //       alignCenter: true, // 希望松手的时候可以居中
    //       id:String(new Date().getTime()) + String(Math.floor(Math.random() * 1000)),// 这里用于生成id便于for的key，不然出现很多bug
    //       props:{},
    //       model:{}
    //     },
    //   ],
    // };

    currentComponent = null;
  };

  const dragStart = (e, component) => {
    containerRef.value.addEventListener("dragenter", dragenter);
    containerRef.value.addEventListener("dragover", dragover);
    containerRef.value.addEventListener("dragleave", dragleave);
    containerRef.value.addEventListener("drop", drop);
    currentComponent = component;
    events.emit("start"); // 发布start
  };
  const dragEnd = (e) => {
    // 移除事件
    containerRef.value.removeEventListener("dragenter", dragenter);
    containerRef.value.removeEventListener("dragover", dragover);
    containerRef.value.removeEventListener("dragleave", dragleave);
    containerRef.value.removeEventListener("drop", drop);
    events.emit("end"); // 发布end
  };

  return {
    dragStart,
    dragEnd,
  };
}
