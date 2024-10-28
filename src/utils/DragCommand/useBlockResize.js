
import { events } from "../event";
export function useBlockResize(focusData,selectionBounds,data) {
    let stateData = {}
    // 获取容器边界
    const containerRect = data.container;
    
    const onMouseMove = (e)=>{
        let {clientX,clientY} = e;
        let {startX,startY,blocks,direction,dragging} = stateData;
        if(!dragging) {
            data.dragging = true;
            events.emit('resizeStart')
        }
        blocks.forEach((block) => {
            let { startWidth, startHeight, startLeft, startTop } = block;
            let durX = clientX - startX;
            let durY = clientY - startY;

            if (direction.horizontal === 'center') {
                clientX = startX;
            }
            if (direction.vertical === 'center') {
                clientY = startY;
            }

            if (direction.vertical === 'start') {
                durY = durY * -1;
                startTop -= durY;
            }
            if (direction.horizontal === 'start') {
                durX = durX * -1;
                startLeft -= durX;
            }

            const width = startWidth + durX;
            const height = startHeight + durY;

            // 获取容器的边界
            const maxLeft = containerRect.width - width;
            const maxTop = containerRect.height - height;

            // 限制缩放后的尺寸不超出容器
            startLeft = Math.max(0, Math.min(startLeft, maxLeft));
            startTop = Math.max(0, Math.min(startTop, maxTop));

            block.item.width = width;
            block.item.height = height;
            block.item.left = startLeft;
            block.item.top = startTop;
            block.item.hasResize = true;
        });
    }
    
    const onMouseDown = (e,direction)=>{
        e.stopPropagation();
        const blocks = [
            selectionBounds.value,
            ...focusData.value.focus
        ].filter(Boolean).map(item => ({
            item,
            startWidth: item.width,
            startHeight: item.height,
            startLeft: item.left,
            startTop: item.top
        }));

        stateData = {
            startX: e.clientX,
            startY: e.clientY,
            blocks,
            direction,
            dragging: false,
        };
        document.body.addEventListener('mousemove',onMouseMove)
        document.body.addEventListener('mouseup',onMouseUp)
    }
    const onMouseUp = ()=>{
        if(data.dragging) {
            events.emit('resizeEnd')
        }
        document.body.removeEventListener('mousemove',onMouseMove)
        document.body.removeEventListener('mouseup',onMouseUp)
    }

    return {
        onMouseDown
    }
    
}

