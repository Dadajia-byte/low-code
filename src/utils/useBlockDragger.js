export function useBlockDragger(focusData) {
  let dragState = {
    startX: 0,
    startY: 0,
  };
  const mousedown = (e) => {
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;
    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY;
      block.left = dragState.startPos[index].left + durX;
    });
  };
  const mouseup = (e) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };

  return {
    mousedown,
  };
}
