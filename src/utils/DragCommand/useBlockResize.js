import { ref } from "vue";

export function useBlockResize(focusData, lastSelectBlock, data) {
    let data = ref({})
    const onMouseMove = (e)=>{
        let {clientX,clientY} = e;
        let {startX,startY,startWidth,startHeight,startLeft,startTop,direction} = lastSelectBlock.value;
        if(direction.horizontal ==='center') {
        clientX = startX;
        }
        if(direction.verical ==='center') {
            clientY = startY;
        }
        let durX = clientX-startX;
        let durY = clientY-startY;
        
        if (direction.verical === 'start') {
            durY = durY*-1;
            block.top = startTop - durY;
        }
        if (direction.horizontal === 'start') {
            durX = durX*-1;
            block.left = startLeft - durX;
        }
        
        const width = startWidth + durX;
        const height = startHeight + durY;
        block.width = width;
        block.height = height;
        block.hasResize = true;
        console.log(block);
        
        EditorDataStore.updateBlocks(block);
    }
    
    
    const onMouseDown = (e,direction)=>{
        events.emit('resizeStart')
        e.stopPropagation();
        data.value = {
            startX:e.clientX,
            startY:e.clientY,
            startWidth:block.width,
            startHeight:block.height,
            startLeft:block.left,
            startTop:block.top,
            direction
        }
        
        document.body.addEventListener('mousemove',onMouseMove)
        document.body.addEventListener('mouseup',onMouseUp)
    }
    const onMouseUp = ()=>{
        events.emit('resizeEnd')
        document.body.removeEventListener('mousemove',onMouseMove)
        document.body.removeEventListener('mouseup',onMouseUp)
    }

    return {
        mousedown:onMouseDown
    }
    
}

