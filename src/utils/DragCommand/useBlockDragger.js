
import { events } from "../event";

export function useBlockDragger(focusData, lastSelectBlock,containerRef,scale, data,selectionBounds) {
  let dragState = {
    startX: 0,
    startY: 0,
  };
  let markline = reactive({
    x: null,
    y: null,
    dragging: false, // 当前是否正在拖拽
  });
  function getCorrectedMousePosition(e) {
    const rect = containerRef.value.getBoundingClientRect();
    const correctedX = (e.clientX - rect.left) / scale.value;
    const correctedY = (e.clientY - rect.top) / scale.value;
    return { x: correctedX, y: correctedY };
  }
  const mousedown = (e) => { 
    const { width: BWidth, height: BHeight } = (selectionBounds.value || lastSelectBlock.value); // 最后一个拖拽的元素作为移动物
    let {x,y} = getCorrectedMousePosition(e);
    dragState = {
      startX: x,
      startY: y,
      startLeft: (selectionBounds.value || lastSelectBlock.value).left, // 拖拽前的位置，用于比较是否产生辅助线
      startTop: (selectionBounds.value || lastSelectBlock.value).top,
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
      dragging: false,
      lines: (() => {
        const { unfocused } = focusData.value; // 未拖拽的元素，作为参照物
        let lines = { x: [], y: [] }; // 计算横线的位置，用y来存放横线，用x来存放竖线
        [
          ...unfocused,
          {
            // 增加对容器的对齐
            top: 0,
            left: 0,
            width: data.container.width,
            height: data.container.height,
          },
        ].forEach((block) => {
          const {
            top: ATop,
            left: ALeft,
            width: AWidth,
            height: AHeight,
          } = block;
          // 当元素拖拽到A元素top一致时，显示辅助线，辅助线位置就是ATop
          lines.y.push({ showTop: ATop, top: ATop });
          lines.y.push({ showTop: ATop, top: ATop - BHeight }); // 顶对底
          lines.y.push({
            showTop: ATop + AHeight / 2,
            top: ATop + AHeight / 2 - BHeight / 2,
          }); //中对中
          lines.y.push({
            showTop: ATop + AHeight,
            top: ATop + AHeight,
          }); // 顶对底
          lines.y.push({
            showTop: ATop + AHeight,
            top: ATop + AHeight - BHeight,
          }); // 底对底
          lines.x.push({ showLeft: ALeft, left: ALeft }); // 左对左
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth }); // 右对左
          lines.x.push({
            showLeft: ALeft + AWidth / 2,
            left: ALeft + AWidth / 2 - BWidth / 2,
          }); //中对中
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth,
          }); // 右对右
          lines.x.push({ showLeft: ALeft, left: ALeft - BWidth }); //左对右
        });
        return lines;
      })(),
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  const mousemove = (e) => {
    let { x: moveX, y: moveY } = getCorrectedMousePosition(e);
    if (!dragState.dragging) {
      dragState.dragging = true;
      events.emit("start");
    } // 计算当前元素最新的位置，用于确定是否产生显示线
    let left = dragState.startLeft + (moveX - dragState.startX);
    let top = dragState.startTop + (moveY - dragState.startY);

    // 获取容器的边界
    const containerRect = data.container;
    const BWidth = (selectionBounds.value || lastSelectBlock.value).width;
    const BHeight = (selectionBounds.value || lastSelectBlock.value).height;

    // 限制边界框不超出容器
    left = Math.max(0, Math.min(left, containerRect.width - BWidth));
    top = Math.max(0, Math.min(top, containerRect.height - BHeight));
    
    // 先计算横线 距离参照物元素还有5px时显示辅助线
    let y = null;
    let x = null;
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.y[i];
      if (Math.abs(t - top) < 5) {
        y = s; // 要显示线的位置
        moveY = dragState.startY - dragState.startTop + t; // 容器距离顶部的距离+目标高度
        // 实现快速贴合元素
        break; // 找到一根线后就退出
      }
    }
    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i];
      if (Math.abs(l - left) < 5) {
        x = s; // 要显示线的位置
        moveX = dragState.startX - dragState.startLeft + l; // 容器距离顶部的距离+目标高度
        // 实现快速贴合元素
        break; // 找到一根线后就退出
      }
    }
    markline.x = x; // markline时响应式数据 xy更新会导致视图更新
    markline.y = y;

    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY; // 之前和之后的距离
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY;
      block.left = dragState.startPos[index].left + durX;
    });
  };
  const mouseup = (e) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    markline.x = null;
    markline.y = null;
    if (dragState.dragging) {
      events.emit("end");
    }
  };

  return {
    mousedown,
    markline,
  };
}
