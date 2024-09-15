import { onUnmounted } from "vue";
import { events } from "./event";
import { cloneDeep } from "lodash";
export const useCommand = (data, focusData) => {
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
  registry({
    // 重做
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
  registry({
    // 撤销
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
    // 如果将希望操作放到队列里 可以增加一个属性用于标识
    name: "drag",
    pushQueue: true,
    init() {
      // 初始化操作，默认会执行
      this.before = null;
      // 监控拖拽开始事件
      const start = () => (this.before = cloneDeep(data.value.blocks));
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
      let after = data.value.blocks;
      return {
        redo() {
          // 默认一松手 就把当前的数据做了
          data.value = { ...data.value, blocks: after };
        },
        undo() {
          // 前一步
          data.value = { ...data.value, blocks: before };
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
        before: data.value, // 当前的值
        after: newValue, // 更新之后的值
      };
      return {
        redo: () => {
          data.value = state.after;
        },
        undo: () => {
          data.value = state.before;
        },
      };
    },
  });
  // 置顶
  registry({
    name: "placeTop",
    pushQueue: true,
    execute() {
      let before = cloneDeep(data.value.blocks);
      let after = (() => {
        // 置顶就是在所有的block中找到最大的zIndex再加1
        let { focus, unfocused } = focusData.value;
        let maxZIndex = Math.max(...unfocused.map((item) => item.zIndex)) + 1;
        focus.forEach((block) => (block.zIndex = maxZIndex++)); // 让当前选中的比最大的+1
        return data.value.blocks;
      })();
      return {
        undo: () => {
          // 如果当前blocks前后一致，则不会更新
          data.value = { ...data.value, blocks: before };
        },
        redo: () => {
          data.value = { ...data.value, blocks: after };
        },
      };
    },
  });
  // 置底
  registry({
    name: "placeBottom",
    pushQueue: true,
    execute() {
      let before = cloneDeep(data.value.blocks);
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
        return data.value.blocks;
      })();
      return {
        undo: () => {
          data.value = { ...data.value, blocks: before };
        },
        redo: () => {
          data.value = { ...data.value, blocks: after };
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
