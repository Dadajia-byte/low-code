import { computed } from "vue";
export function useFocus(data, callback) {
  // 获取哪些元素
  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    data.value.blocks.forEach((item) => {
      if (item.focus) {
        focus.push(item);
      } else {
        unfocused.push(item);
      }
    });
    return { focus, unfocused };
  });
  const clearBlockFocus = () => {
    data.value.blocks.forEach((item) => {
      item.focus = false;
    });
  };
  const blockMouseDown = (e, block) => {
    // 在block上规划一个属性 focus 获取焦点后将focus变为true
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      // 按住shift键
      block.focus = !block.focus;
    } else {
      if (!block.focus) {
        clearBlockFocus(); // 一般情况只允许一个block被选中
        block.focus = true;
      } else {
        block.focus = false;
      }
    }
    callback(e);
  };
  const containerMouseDown = () => {
    clearBlockFocus();
  };
  return {
    blockMouseDown,
    focusData,
    containerMouseDown,
  };
}
