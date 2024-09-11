export const useCommand = () => {
  const state = {
    // 前进后退需要指针
    current: -1, // 前进后退的索引值
    queue: [], // 存取所有命令
    commands: {}, // 制作命令和执行功能的一个映射表 undo:()=>{}, redo:()=>{}
    commandArray: [], // 存放所有的命令
  };

  const registry = (command) => {
    state.commandArray.push(command);

    state.commands[command.name] = () => {
      // 获取的是执行函数,多嵌一层以实现闭包
      const { redo } = command.execute();

      redo();
    };
  };
  registry({
    // 重做
    name: "redo",
    keyboard: "ctrl+y",
    execute() {
      return {
        redo() {
          console.log("重做");
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
          console.log("撤销");
        },
      };
    },
  });
  registry({
    // 如果将操作放到队列里
    name: "drag",
  });
  return state;
};
