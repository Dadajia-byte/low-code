import { defineStore } from "pinia";
import { cloneDeep } from "lodash";
export const useEditorDataStore = defineStore("editorDataStore", () => {
    const data = reactive({
        container: {
            height: 800,
            width: 1000,
        },
        blocks: [],

    });
    const formData = reactive({
        username: 'admin',
        password: '123456',
    })

    const updateData = (newValue) => {
        data.container = cloneDeep(newValue.container);
        data.blocks = newValue.blocks;
    }
    const updateBlocks = (newBlock) => {
        console.log(11111);
        
        const index = data.blocks.findIndex(block => block.id === newBlock.id);
        if (index !== -1) {
            // 使用 splice 保证响应式
            data.blocks.splice(index, 1, newBlock);
        }
    }

    
    return {
    data,
    formData,
    updateData,
    updateBlocks,
}
});