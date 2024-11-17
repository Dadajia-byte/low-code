import {events} from "../event";
import {useEditorDataStore} from "@/store/index.js";
import {cloneDeep} from "lodash";

let history = [];
let historyIndex = -1;
export const setHistoryIndex = (num)=>{
    historyIndex = num
}
function useBlockResize(focusData,selectionBounds,scale,data) {
    const editorDataStore = useEditorDataStore();
    let stateData = {}
    // 获取容器边界
    const containerRect = data.container;    
    const onMouseMove = (e) => {
        let { clientX, clientY } = e;
        let { startX, startY, blocks, direction, dragging } = stateData;

        blocks.forEach((block) => {
            let { startWidth, startHeight, startLeft, startTop } = block;
            let durX = (clientX - startX)/scale.value;
            let durY = (clientY - startY)/scale.value;

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
            // 设置宽度和高度的最小值和最大值
            const minWidth = 20; // 最小宽度
            const maxWidth = 300; // 最大宽度
            const minHeight = 20; // 最小高度
            const maxHeight = 150; // 最大高度

            const finalWidth = Math.max(minWidth, Math.min(width, maxWidth));
            const finalHeight = Math.max(minHeight, Math.min(height, maxHeight));

            // 获取容器的边界
            const maxLeft = containerRect.width - finalWidth;
            const maxTop = containerRect.height - finalHeight;

            // 限制缩放后的尺寸不超出容器
            startLeft = Math.max(0, Math.min(startLeft, maxLeft));
            startTop = Math.max(0, Math.min(startTop, maxTop));

            block.item.width = finalWidth;
            block.item.height = finalHeight;
            block.item.left = startLeft;
            block.item.top = startTop;
            block.item.hasResize = true;
            editorDataStore.updateBlocks(block);
        });

        if (!dragging) {
            stateData.dragging = true;
            events.emit('resizeStart');
        }
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
        // 记录当前状态到 history
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(cloneDeep(editorDataStore.data.blocks));
        setHistoryIndex(history.length - 1);
        console.log(history,'before');
        
        document.body.addEventListener('mousemove',onMouseMove)
        document.body.addEventListener('mouseup',onMouseUp)
    }
    const onMouseUp = () => {
        if (stateData.dragging) {
            events.emit('resizeEnd');
            stateData.dragging = false;

            // 记录缩放结束时的状态
            history.push(cloneDeep(editorDataStore.data.blocks));
            setHistoryIndex(history.length - 1);
            console.log(history,'after');
            
        }

        document.body.removeEventListener('mousemove', onMouseMove);
        document.body.removeEventListener('mouseup', onMouseUp);
    };

    return {
        onMouseDown
    }
    
}

export {
    history,
    historyIndex,
    useBlockResize
}