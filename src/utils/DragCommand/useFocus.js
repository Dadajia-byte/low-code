/**
 *
 * @param {*reactive} data 传入的data数据（就是editorStore那个，后期需要考虑二选一，现在混在一起）
 * @param {*ref} editorOperatorStatus 编辑操作栏中的状态，如果是true代表鼠标模式，false代表抓手模式应该禁用focus相关操作
 * @param {*ref} containerRef 容器的ref
 * @param {*function} callback 回调函数
 * @returns
 */
export function useFocus(data, editorOperatorStatus, containerRef, scale,offsetState, callback) {

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
  //鼠标拖拽状态
  const mouseDrag = ref({
    dragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  

  function getCorrectedMousePosition(e) {
    const rect = containerRef.value.getBoundingClientRect();
    // 校正鼠标位置，缩放对应的缩放比例
    const correctedX = (e.clientX - rect.left) / scale.value;
    const correctedY = (e.clientY - rect.top) / scale.value;
    return { x: correctedX, y: correctedY };
  }
  //鼠标选取范围
  const mouseSelectArea = ref({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  const clearBlockFocus = () => {
    data.blocks.forEach((item) => {
      item.focus = false;
    });
  };
  const blockMouseDown = (e, block, index) => {
    if (!editorOperatorStatus.value) return;
    // 在block上规划一个属性 focus 获取焦点后将focus变为true
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      // 按住shift键

      if (focusData.value.focus.length <= 1) {
        block.focus = true; // 当前只有一个节点被选中时，按住shift键 也不会切换focus状态
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
  //鼠标点击画板
  const containerMouseDown = (e) => {
    if (!editorOperatorStatus.value) {
      // onMouseDownGrab(e);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    clearBlockFocus();
    selectIndex.value = -1;

    // 初始化
    const { x, y } = getCorrectedMousePosition(e);  // 获取相对于画布的坐标
    mouseDrag.value.dragging = true;
    mouseDrag.value.startX = x;
    mouseDrag.value.startY = y;

    document.addEventListener('mousemove', onMouseMoveSelect);
    document.addEventListener('mouseup', onMouseUpSelect);

  };

  //鼠标抓手移动点击
  const onMouseDownGrab = (e) => {

    e.preventDefault();
    e.stopPropagation();
    clearBlockFocus();

    const { x, y } = getCorrectedMousePosition(e);

    mouseDrag.value.startX = x;
    mouseDrag.value.startY = y;
    document.addEventListener("mousemove", onMouseMoveGrab);
    document.addEventListener("mouseup", onMouseUpGrab);
  };
  const onMouseMoveGrab = (e) => {
    const { x, y } = getCorrectedMousePosition(e)
    mouseDrag.value.currentX = x;
    mouseDrag.value.currentY = y;
    offsetState.value.offsetX = mouseDrag.value.currentX - mouseDrag.value.startX
    offsetState.value.offsetY = mouseDrag.value.currentY - mouseDrag.value.startY
    
    containerRef.value.style.transform = `translate(${offsetState.value.offsetX + offsetState.value.preOffsetX}px, ${offsetState.value.offsetY + offsetState.value.preOffsetY}px) scale(${scale.value})`;
  };
  const onMouseUpGrab = (e) => {
    const { x, y } = getCorrectedMousePosition(e)
    mouseDrag.value.currentX = x;
    mouseDrag.value.currentY = y;
    // 计算本次拖拽的偏移量
    const finalOffsetX = mouseDrag.value.currentX - mouseDrag.value.startX;
    const finalOffsetY = mouseDrag.value.currentY - mouseDrag.value.startY;

    // 更新累计偏移量
    offsetState.value.preOffsetX += finalOffsetX;
    offsetState.value.preOffsetY += finalOffsetY;

    document.removeEventListener('mousemove', onMouseMoveGrab);
    document.removeEventListener('mouseup', onMouseUpGrab);
  };

  //鼠标选取移动
  const onMouseMoveSelect = (e) => {
    const { x, y } = getCorrectedMousePosition(e);
    const {
      left: containerLeft,
      top: containerTop,
      width: containerWidth,
      height: containerHeight
    } = containerRef.value.getBoundingClientRect();
    mouseDrag.value.currentX = Math.min(containerWidth, Math.max(0, x));
    mouseDrag.value.currentY = Math.min(containerHeight, Math.max(0, y));


    const width = Math.abs(mouseDrag.value.currentX - mouseDrag.value.startX);
    const height = Math.abs(mouseDrag.value.currentY - mouseDrag.value.startY);

    const newLeft = Math.max(0, Math.min(mouseDrag.value.startX, mouseDrag.value.currentX));
    const newTop = Math.max(0, Math.min(mouseDrag.value.startY, mouseDrag.value.currentY));
    const newWidth = Math.min(Math.abs(width), newLeft + width);
    const newHeight = Math.min(Math.abs(height), newTop + height);

    mouseSelectArea.value.top = newTop;
    mouseSelectArea.value.left = newLeft;
    mouseSelectArea.value.width = newWidth;
    mouseSelectArea.value.height = newHeight;
  };
  //重置拖拽数据
  const resetDragData = () => {
    mouseDrag.value = {
      dragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    };
    mouseSelectArea.value.top = 0;
    mouseSelectArea.value.left = 0;
    mouseSelectArea.value.width = 0;
    mouseSelectArea.value.height = 0;


  };
  //鼠标抬起
  const onMouseUpSelect = () => {
    mouseDrag.value.dragging = false;

        data.blocks.forEach(item => {
            const {left, top, width, height} = item;
            const itemRight = left + width;
            const itemBottom = top + height;

      item.focus = (
        top >= mouseSelectArea.value.top &&
        left >= mouseSelectArea.value.left &&
        itemBottom <= mouseSelectArea.value.top + mouseSelectArea.value.height &&
        itemRight <= mouseSelectArea.value.left + mouseSelectArea.value.width
      );
    });
    resetDragData();
    document.removeEventListener('mousemove', onMouseMoveSelect);
    document.removeEventListener('mouseup', onMouseUpSelect);
  };

  const selectionBoundsMouseDown = (e) => {
    if (!editorOperatorStatus.value) return;
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
    mouseDrag,
   
  };
}
