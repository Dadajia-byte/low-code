import {defineStore} from "pinia";
import {cloneDeep} from "lodash";
import {reactive} from "vue";

export const useEditorDataStore = defineStore("editorDataStore", () => {
    const data = reactive({
        container: {
            height: 800,
            width: 1000,
            grid: true,
        },
        blocks: [],
    });
    // 剪切板，肯定存的只有blocks（多重选中或者单个选中）
    const clipboard = reactive({
        blocks: [],
    })
    let focusUpdate = ref(0);
    const formData = reactive({
        username: 'admin',
        password: '123456',
    })

    const updateData = (newValue) => {
        focusUpdate.value++;
        data.container = cloneDeep(newValue.container);
        data.blocks = newValue.blocks;
    }
    const updateBlocks = (newBlock) => {
        focusUpdate.value++;
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
        focusUpdate,
        clipboard
    }
});