import { reactive } from "vue";

export function useFocus(data, previewRef, containerRef, callback) {

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
  const calculateSelectionBounds = computed(() => {
    if (focusData.value.focus.length <= 1) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    focusData.value.focus.forEach(item => {
      const { left, top, width, height } = item;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + width);
      maxY = Math.max(maxY, top + height);
    });

    return {
      left: minX - 4,
      top: minY - 4,
      width: maxX - minX + 6,
      height: maxY - minY + 6
    }
  })

  const mouseDrag = ref({
    dragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  //鼠标选取范围
  const mouseSelectArea = reactive({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const clearBlockFocus = () => {
    data.blocks.forEach((item) => item.focus = false)
  };
  const blockMouseDown = (e, block, index) => {
    if (previewRef.value) return;
    // 在block上规划一个属性 focus 获取焦点后将focus变为true
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      // 按住shift键
       block.focus = focusData.value.focus.length <= 1 || block.focus;
    } else {
      if (!block.focus) {
        clearBlockFocus(); // 一般情况只允许一个block被选中
        block.focus = true;
      }
    }
    selectIndex.value = index;
    callback(e);
  };
  //鼠标点击画板
  const containerMouseDown = (e) => {
    if (previewRef.value) return;
    e.preventDefault();
    e.stopPropagation();
    clearBlockFocus();
    selectIndex.value = -1;
    // 初始化
    mouseDrag.value = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    };


    document.addEventListener('mousemove', onMouseMoveSelect);
    document.addEventListener('mouseup', onMouseUpSelect);
  };
//鼠标移动
  const onMouseMoveSelect = (e) => {
    mouseDrag.value.currentX = e.clientX;
    mouseDrag.value.currentY = e.clientY;

    const { left: containerLeft, top: containerTop, width: containerWidth, height: containerHeight } = containerRef.value.getBoundingClientRect();

    const width = mouseDrag.value.currentX - mouseDrag.value.startX;
    const height = mouseDrag.value.currentY - mouseDrag.value.startY;

    const newLeft = Math.max(containerLeft, Math.min(mouseDrag.value.startX, mouseDrag.value.currentX));
    const newTop = Math.max(containerTop, Math.min(mouseDrag.value.startY, mouseDrag.value.currentY));
    const newWidth = Math.min(Math.abs(width), containerWidth - (newLeft - containerLeft));
    const newHeight = Math.min(Math.abs(height), containerHeight - (newTop - containerTop));

    mouseSelectArea.top = newTop - containerTop;
    mouseSelectArea.left = newLeft - containerLeft;
    mouseSelectArea.width = newWidth;
    mouseSelectArea.height = newHeight;
  };

  const resetDragData = () => {
    mouseDrag.value = {
      dragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    };
    mouseSelectArea.top = 0;
    mouseSelectArea.left = 0;
    mouseSelectArea.width = 0;
    mouseSelectArea.height = 0;
  };
//鼠标抬起
  const onMouseUpSelect = () => {
    mouseDrag.value.dragging = false;

    data.blocks.forEach(item => {
      const { left, top, width, height } = item;
      const itemRight = left + width;
      const itemBottom = top + height;

    item.focus = (
      top >= mouseSelectArea.top &&
      left >= mouseSelectArea.left &&
      itemBottom <= mouseSelectArea.top + mouseSelectArea.height &&
      itemRight <= mouseSelectArea.left + mouseSelectArea.width
    );
  });
    document.removeEventListener('mousemove', onMouseMoveSelect);
    document.removeEventListener('mouseup', onMouseUpSelect);
    resetDragData();
  };
 
  const selectionBoundsMouseDown = (e) => {
    e.stopPropagation();
    callback(e);
  }
  return {
    blockMouseDown,
    focusData,
    containerMouseDown,
    selectionBoundsMouseDown,
    lastSelectBlock,
    clearBlockFocus,
    selectionBounds: calculateSelectionBounds,
    mouseSelectArea,
    mouseDrag
  };
}
