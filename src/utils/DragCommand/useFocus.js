import { computed } from "vue";

export function useFocus(data, previewRef, callback) {
  // console.log(data.blocks);

  const selectIndex = ref(-1); // 记录最后一个被点击的元素
  const lastSelectBlock = computed(() => data.blocks[selectIndex.value]);
  // 获取哪些元素
  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    data.blocks.forEach((item) => {
      if (item.focus) {
        focus.push(item);
      } else {
        unfocused.push(item);
      }
    });
    return { focus, unfocused };
  });
  // 计算选中元素的边界
  const calculateSelectionBounds = computed(()=>{
    if(focusData.value.focus.length<=1) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    focusData.value.focus.forEach(item=>{
      const {left,top,width,height} = item;
      minX = Math.min(minX,left);
      minY = Math.min(minY,top);
      maxX = Math.max(maxX,left+width);
      maxY = Math.max(maxY,top+height);
    });
    
    return {
      left:minX-4,
      top:minY-4,
      width:maxX-minX+6,
      height:maxY-minY+6
    }
  })
  const clearBlockFocus = () => {
    data.blocks.forEach((item) => {
      item.focus = false;
    });
  };
  const blockMouseDown = (e, block, index) => {
    if (previewRef.value) return;
    // 在block上规划一个属性 focus 获取焦点后将focus变为true
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      // 按住shift键
      if (focusData.value.focus.length <= 1) {
        block.focus = true; // 当前只有一个节点被选中时，按住shift键 也不会切换focous状态
      } else {
        block.focus = !block.focus;
      }
    } else {
      if (!block.focus) {
        clearBlockFocus(); // 一般情况只允许一个block被选中
        block.focus = true;
      }
    }
    selectIndex.value = index;
    callback(e);
  };
  const containerMouseDown = () => {
    if (previewRef.value) return;
    clearBlockFocus();
    selectIndex.value = -1;
  };
  return {
    blockMouseDown,
    focusData,
    containerMouseDown,
    lastSelectBlock,
    clearBlockFocus,
    selectionBounds:calculateSelectionBounds,
  };
}
