import { events } from "../event";
import { cloneDeep } from "lodash";
import { useEditorDataStore } from "../../store/module/editorData";
import { setActivePinia, getActivePinia } from 'pinia';


export const useCommand = (data, focusData) => {
  // 激活pinia
  if (!getActivePinia()) {
    const pinia = createPinia();
    setActivePinia(pinia);
  }

  const editorDataStore = useEditorDataStore();
  const state = {
    // 前进后退需要指针
    current: -1, // 前进后退的索引值
    queue: [], // 存取所有命令
    commands: {}, // 制作命令和执行功能的一个映射表 undo:()=>{}, redo:()=>{}
    commandArray: [], // 存放所有的命令
    destroyedList: [], // 销毁列表
  };

  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = (...args) => {
      // 获取的是执行函数,多嵌一层以实现闭包
      const { redo, undo } = command.execute(...args);
      redo();
      if (!command.pushQueue) {
        return;
      }
      let { queue, current } = state;
      // 如果 放置 组件1 -> 组件2 -> 撤回 -> 组件3
      // 组件1 -> 组件3
      if (queue.length > 0) {
        queue = queue.splice(0, current + 1); //可能放置过程中有撤销操作，所以根据当前最新的current值来计算新的队列
        state.queue = queue;
      }
      queue.push({ redo, undo }); // 保存指令的前进与后退
      state.current = current + 1; // 索引加一
    };
  };
  // 重做
  registry({

    name: "redo",
    keyboard: "ctrl+y",
    execute() {
      return {
        redo() {
          let item = state.queue[state.current + 1];
          if (item) {
            item.redo && item.redo();
            state.current++;
          }
        },
      };
    },
  });
  // 撤销
  registry({

    name: "undo",
    keyboard: "ctrl+z",
    execute() {
      return {
        redo() {
          if (state.current === -1) return; // 没有可以撤销的操作
          let item = state.queue[state.current];
          if (item) {
            item.undo && item.undo();
            state.current--;
          }
        },
      };
    },
  });
  registry({
    name: "drag",
    pushQueue: true,// 如果将希望操作放到队列里 可以增加一个属性用于标识
    init() {
      // 初始化操作，默认会执行
      this.before = null;
      // 监控拖拽开始事件
      const start = () => (this.before = cloneDeep(data.blocks));
      // 拖拽之后需要触发的指令
      const end = () => state.commands.drag();
      events.on("start", start);
      events.on("end", end);
      return () => {
        events.off("start");
        events.off("end");
      };
    },
    execute() {
      let before = this.before;
      let after = data.blocks;
      return {
        redo() {
          // 默认一松手 就把当前的数据做了
          // data = { ...data, blocks: after };
          editorDataStore.updateData({ ...data, blocks: after })
        },
        undo() {
          // 前一步
          // data = { ...data, blocks: before };
          editorDataStore.updateData({ ...data, blocks: before })

        },
      };
    },
  });
  // 更新整个容器
  registry({
    name: "updateContainer",
    pushQueue: true,
    execute(newValue) {
      let state = {
        before: data, // 当前的值
        after: newValue, // 更新之后的值
      };
      return {
        redo: () => {
          // data = state.after;
          editorDataStore.updateData(state.after)

        },
        undo: () => {
          // data = state.before;
          editorDataStore.updateData(state.before)

        },
      };
    },
  });
  // 更新单个block
  registry({
    name: "updateBlock",
    pushQueue: true,
    execute(newValue,oldValue) {
      let state = {
        before: data.blocks, // 当前的值
        after: (()=>{
          let blocks = [...data.blocks]; // 拷贝一份用于赋值
          const index = data.blocks.indexOf(oldValue); // 找到老的索引值
          if(index>-1) {
            const newId = String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))
            newValue = {...newValue,id:newId}
            blocks.splice(index,1,newValue) // 重新赋值
          }
          return blocks
        })(), // 更新之后的值
      };
      return {
        redo: () => {
          // data = {...data,blocks:state.after};
          editorDataStore.updateData({ ...data, blocks: state.after })

        },
        undo: () => {
          // data = {...data,blocks:state.before};
          editorDataStore.updateData({ ...data, blocks: state.before })

        },
      };
    },
  });
  // 置顶
  registry({
    name: "placeTop",
    pushQueue: true,
    execute() {
      let before = cloneDeep(data.blocks);
      let after = (() => {
        // 置顶就是在所有的block中找到最大的zIndex再加1
        let { focus, unfocused } = focusData.value;
        let maxZIndex = Math.max(...unfocused.map((item) => item.zIndex)) + 1;
        focus.forEach((block) => (block.zIndex = maxZIndex++)); // 让当前选中的比最大的+1
        return data.blocks;
      })();
      return {
        undo: () => {
          // 如果当前blocks前后一致，则不会更新
          // data = { ...data, blocks: before };
          editorDataStore.updateData({ ...data, blocks: before })

        },
        redo: () => {
          // data = { ...data, blocks: after };
          editorDataStore.updateData({ ...data, blocks: after })

        },
      };
    },
  });
  // 置底    
  registry({
    name: "placeBottom",
    pushQueue: true,
    execute() {
      let before = cloneDeep(data.blocks);
      let after = (() => {
        // 置底就是在所有的block中找到最小的zIndex再减1，但是index不能是负的,所以让其他unfocused全部+1即可
        let { focus, unfocused } = focusData.value;
        let minZIndex = Math.min(...unfocused.map((item) => item.zIndex)) - 1;
        if (minZIndex < 0) {
          const dur = Math.abs(minZIndex);
          minZIndex = 0;
          unfocused.forEach((block) => (block.zIndex += dur));
        }
        focus.forEach((block) => (block.zIndex = minZIndex));
        return data.blocks;
      })();
      return {
        undo: () => {
          // data = { ...data, blocks: before };
          editorDataStore.updateData({ ...data, blocks: before })

        },
        redo: () => {
          // data = { ...data, blocks: after };
          editorDataStore.updateData({ ...data, blocks: after })

        },
      };
    },
  });
  // 删除
  registry({
    name: "delete",
    pushQueue: true,
    execute() {
      let state = {
        before: cloneDeep(data.blocks), // 保证唯一
        after: focusData.value.unfocused, // 留下的都是未选中的
      };
      return {
        redo: () => {
          // data = { ...data, blocks: state.after };
          
          editorDataStore.updateData({ ...data, blocks: state.after })

        },
        undo: () => {
          // data = { ...data, blocks: state.before };

          editorDataStore.updateData({ ...data, blocks: state.before })

        },
      };
    },
  });
  // 键盘事件
  const keyboardEvent = (() => {
    const keyCodes = {
      90: "z",
      89: "y",
    };
    const onKeydown = (e) => {
      const { ctrlKey, keyCode } = e;
      let keyString = [];
      if (ctrlKey) keyString.push("ctrl");
      keyString.push(keyCodes[keyCode]);
      keyString = keyString.join("+");
      // 根据键盘按键调用对应的事件
      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return; // 没有对应的键盘事件
        if (keyboard === keyString) {
          state.commands[name]();
          e.preventDefault();
        }
      });
    };
    const init = () => {
      // 初始化事件
      window.addEventListener("keydown", onKeydown);
      return () => {
        // 销毁事件
        window.removeEventListener("keydown", onKeydown);
      };
    };
    return init;
  })();
  // 检测该命令是否需要初始化
  (() => {
    state.destroyedList.push(keyboardEvent());
    state.commandArray.forEach(
      (command) => command.init && state.destroyedList.push(command.init())
    );
  })();
  onUnmounted(() => {
    // 清理绑定的事件
    state.destroyedList.forEach((fn) => fn && fn());
  });
  return state;
};
