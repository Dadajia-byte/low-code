import { reactive, ref } from "vue";



export function useMouseWheel(containerRef) {

    
    let scale = ref(1);//缩放比例
     const offsetWidth = reactive({
        offsetX: 0,
        offsetY: 0,
     })
    const handleMousewheel = (e) => {

        if (e.ctrlKey) {
            e.preventDefault();
            const deltaY = e.deltaY;
            const clientX = e.clientX;
            const clientY = e.clientY;
            const isZoomOut = deltaY < 0;
            const newScale = getNewScale(scale.value, isZoomOut);
            handleZoom(newScale, scale.value, clientX, clientY);
            scale.value = newScale;
        }
    }
    function getNewScale(preScale, isZoomOut) {
        return isZoomOut ? preScale + 0.1 : preScale - 0.1;
    }
    //处理缩放
    function handleZoom(newScale, oldScale, clientX, clientY) {
        let scaleRatio = newScale / oldScale;
        const container = containerRef.value;
        
        const rect = container.getBoundingClientRect();
        console.log();

        let offsetX = (1 - scaleRatio) * (clientX - rect.left);
        let offsetY = (1 - scaleRatio) * (clientY - rect.top);
        
        // 更新容器的变换样式以实现缩放和位置调整
        container.style.transform = `scale(${newScale})`;
        // container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${newScale})`;
    }

   
    return{
        handleMousewheel,
        scale,
        offsetWidth
    }
}