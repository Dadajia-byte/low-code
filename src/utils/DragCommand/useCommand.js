import {events} from "../event";
import {cloneDeep} from "lodash";
import {useEditorDataStore} from "@/store/index.js";
import {getActivePinia, setActivePinia} from 'pinia';
import {history, historyIndex, setHistoryIndex} from "./useBlockResize";
import {events} from "../event";
import {cloneDeep} from "lodash";
import {useEditorDataStore} from "@/store/index.js";
import {getActivePinia, setActivePinia} from 'pinia';
import {history, historyIndex, setHistoryIndex} from "./useBlockResize";


export const useCommand = (data, focusData, containerRef = null) => {
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

    // 注册指令函数
    const registry = (command) => {
        state.commandArray.push(command);
        state.commands[command.name] = (...args) => {
            // 获取的是执行函数,多嵌一层以实现闭包
            const {redo, undo} = command.execute(...args);
            redo();
            if (!command.pushQueue) {
                return;
            }
            let {queue, current} = state;
            // 如果 放置 组件1 -> 组件2 -> 撤回 -> 组件3
            // 组件1 -> 组件3
            if (queue.length > 0) {
                queue = queue.splice(0, current + 1); //可能放置过程中有撤销操作，所以根据当前最新的current值来计算新的队列
                state.queue = queue;
            }
            queue.push({redo, undo}); // 保存指令的前进与后退
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
    // 缩放
    registry({
        name: 'resize',
        pushQueue: true,
        init() {
            this.before = null;
            const start = () => (this.before = cloneDeep(history[historyIndex]));
            const end = () => state.commands.resize();
            events.on("resizeStart", start);
            events.on("resizeEnd", end);
            return () => {
                events.off("resizeStart");
                events.off("resizeEnd");
            };
        },
        execute() {
            let before = this.before;
            let after = history[historyIndex];
            return {
                redo() {
                    if (historyIndex < history.length - 1) {
                        setHistoryIndex(historyIndex + 1)
                        after = history[historyIndex]
                        editorDataStore.updateData({...data, blocks: after})
                    }
                },
                undo() {
                    // data = { ...data, blocks: before };
                    if (historyIndex > 0) {
                        setHistoryIndex(historyIndex - 1);
                        before = history[historyIndex];
                        editorDataStore.updateData({...data, blocks: before})
                    }
                },
            };
        }
    })
    // 拖曳
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
                    editorDataStore.updateData({...data, blocks: after})
                },
                undo() {
                    // 前一步
                    // data = { ...data, blocks: before };
                    editorDataStore.updateData({...data, blocks: before})

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
        execute(newValue, oldValue) {
            let state = {
                before: data.blocks, // 当前的值
                after: (() => {
                    let blocks = [...data.blocks]; // 拷贝一份用于赋值
                    const index = data.blocks.indexOf(oldValue); // 找到老的索引值
                    if (index > -1) {
                        const newId = String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))
                        newValue = {...newValue, id: newId}
                        blocks.splice(index, 1, newValue) // 重新赋值
                    }
                    return blocks
                })(), // 更新之后的值
            };
            return {
                redo: () => {
                    // data = {...data,blocks:state.after};
                    editorDataStore.updateData({...data, blocks: state.after})

                },
                undo: () => {
                    // data = {...data,blocks:state.before};
                    editorDataStore.updateData({...data, blocks: state.before})

                },
            };
        },
    });
    // 复制
    registry({
        name: "copy",
        keyboard: "ctrl+c",
        execute() {
            // 可能是单个block，也可能是多选的所以传入的应该是一个数组
            // 实际操作应该是将这几个block放到剪切板中
            let {focus} = focusData.value;

            return {
                redo() {
                    if (focus.length > 0) {
                        // 计算基准位置（选中块的最小 left 和 top）
                        const offsetX = Math.min(...focus.map(block => block.left));
                        const offsetY = Math.min(...focus.map(block => block.top));
                        editorDataStore.clipboard = {
                            blocks: cloneDeep(focus),
                            offsetX,  // 保存偏移位置
                            offsetY
                        };
                    }
                }
            }
        }
    })
    // 剪切
    registry({
        name: 'cut',
        keyboard: 'ctrl+x',
        pushQueue: true,
        execute() {
            // 剪切实际上就是：
            // 1. 执行复制操作
            // 2. 将剪切的blocks(focus)从原本的data中删除,即替换为unfocused
            let {focus, unfocused} = focusData.value;
            let before = cloneDeep(data.blocks);
            let clipboardBefore = cloneDeep(editorDataStore.clipboard)
            return {
                redo() {
                    if (focus.length > 0) {
                        // 计算基准位置（选中块的最小 left 和 top）
                        const offsetX = Math.min(...focus.map(block => block.left));
                        const offsetY = Math.min(...focus.map(block => block.top));
                        editorDataStore.clipboard = {
                            blocks: cloneDeep(focus),
                            offsetX,  // 保存偏移位置
                            offsetY
                        };
                        // 2. 将剪切的 blocks 从原本的 data 中删除
                        editorDataStore.updateData({...data, blocks: unfocused})
                    }
                },
                undo() {
                    editorDataStore.updateData({...data, blocks: before})
                    editorDataStore.clipboard = clipboardBefore
                }

            }
        }
    })
    // 粘贴
    registry({
        name: "paste",
        keyboard: "ctrl+v",
        pushQueue: true,
        execute(e) {
            let before = cloneDeep(data.blocks);
            // 粘贴的时候，从剪切板中拿出blocks，push到data的blocks中，但是要注意以下几点：
            // 1. 所有block的id都得重新生成
            // 2. 所有block的left和top应该相较于鼠标位置和原先位置重新计算
            // 3. 粘贴后，自动将focused转变为粘贴的blocks
            // 4. 考虑到键盘触发传入的e是键盘事件，无法获取鼠标位置以计算新位置，需要重新考量
            // 画布位置，用于结合鼠标位置计算新位置
            let {blocks, offsetX, offsetY} = editorDataStore.clipboard;
            if (!blocks || blocks.length === 0) return; // 虽然根本就进不来，但为了保险还是加一下
            let pastedBlocks = [];
            // 获取粘贴位置，优先使用鼠标事件的位置
            const getPastePosition = () => {
                if (e.clientX !== undefined && e.clientY !== undefined) {
                    // 使用鼠标事件的位置
                    return {x: e.clientX, y: e.clientY};
                } else {
                    // 使用记录的最后一次鼠标位置
                    return lastMousePosition;
                }
            };
            // 生成新的 blocks
            const generatePastedBlocks = () => {
                const {x: mouseX, y: mouseY} = getPastePosition();
                const containerRect = containerRef.value.getBoundingClientRect();

      return blocks.map((block) => {
        return {
          ...cloneDeep(block),
          id: String(new Date().getTime()) + String(Math.floor(Math.random() * 1000)), // 重新生成唯一id
          left: block.left + (mouseX - offsetX) - block.width / 2 - containerRect.left,
          top: block.top + (mouseY - offsetY) - block.height / 2 - containerRect.top,
          focus: true,
        };
      });
    };
      return {        
        redo() {
          editorDataStore.data.blocks.forEach(item=>item.focus = false)        
          pastedBlocks = generatePastedBlocks();
          editorDataStore.data.blocks.push(...pastedBlocks);
        },
        undo() {
          // 删除刚刚插入的block
          editorDataStore.updateData({ ...data, blocks: before })
        }
      };
    }
  })
  // 置顶
  registry({
    name: "placeTop",
    pushQueue: true,
    keyboard: "ctrl+shift+[",
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
    keyboard: "ctrl+shift+]",
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
  // 上移一层
  registry({
    name: "placeUp",
    pushQueue: true,
    keyboard: "ctrl+[",
    execute() {
      let before = cloneDeep(data.blocks);
      let after =(()=>{
        let {focus} = focusData.value
        focus.forEach(block=>block.zIndex++)
        console.log(data.blocks);
        
        return data.blocks
      })()
      return {
        undo: () => {
          editorDataStore.updateData({ ...data, blocks: before })
        },
        redo: () => {
          editorDataStore.updateData({ ...data, blocks: after })
        },
      }
    }

  })
  // 下移一层
  registry({
    name: "placeDown",
    pushQueue: true,
    keyboard: "ctrl+]",
    execute() {
      let before = cloneDeep(data.blocks);
      // 本来应该是让选中block下移一层，但考虑<0情况，让所有unfocused+1即可
      let after = (() => {
        let {unfocused} = focusData.value
        unfocused.forEach(block=>block.zIndex++)
        return data.blocks
      })()
      return {
        undo: () => {
         editorDataStore.updateData({ ...data, blocks: before })
        },
        redo: () => {
          editorDataStore.updateData({ ...data, blocks: after })
        },
      }
    }
  })
  // 删除
  registry({
    name: "delete",
    pushQueue: true,
    keyboard:['delete','backspace'],
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
  /* 鼠标监听相关 */
  let lastMousePosition = { x: 0, y: 0 };
  let isMouseMoveEnabled = false;
  function handleMouseMove(e) {
    lastMousePosition ={
      x: e.clientX,
      y: e.clientY
    }   
  }
  // 键盘事件
  const keyboardEvent = (() => {
    // 按键映射表
    const keyCodes = {
      221:']',
      219:'[',
      90:"z",
      89:"y",
      88:'x',
      86:'v',
      67:"c",
      46:'delete',
      8:'backspace',
    };
    const onKeydown = (e) => {
      const { ctrlKey, keyCode,shiftKey } = e;
      let keyString = [];
      if (ctrlKey) keyString.push("ctrl");
      if (shiftKey) keyString.push("shift");
      keyString.push(keyCodes[keyCode]);
      keyString = keyString.join("+");
      // 判断是否启用鼠标监听（因为很耗费性能所以只在按下ctrl键时开始监控）
      if(ctrlKey && !isMouseMoveEnabled) {
        document.addEventListener("mousemove", handleMouseMove);
        isMouseMoveEnabled = true;
      }
      // 根据键盘按键调用对应的事件
      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return; // 没有对应的键盘事件
        if (Array.isArray(keyboard)? keyboard.includes(keyString):keyboard === keyString) {
          state.commands[name](e);
          e.preventDefault();
        }
      });
    };
    const onKeyup = (e) => {
      if (e.key === 'Control') {
        if (isMouseMoveEnabled) {
          document.removeEventListener("mousemove", handleMouseMove);
          isMouseMoveEnabled = false;
        }
      }
    };
    return () => {
      // 初始化事件
      document.addEventListener("keydown", onKeydown);
      document.addEventListener("keyup", onKeyup);
      return () => {
        // 销毁事件
        document.removeEventListener("keydown", onKeydown);
        document.removeEventListener("keyup", onKeyup);
      };
    };
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




