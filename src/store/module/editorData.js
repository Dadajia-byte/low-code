import { defineStore } from "pinia";
export const useEditorDataStore = defineStore("editorDataStore", () => {
    const data = reactive({
        container: {
            height: '800',
            width: '1000',
        },
        blocks: [],

    });
    const formData = reactive({
        username: 'admin',
        password: '123456',
    })

    const updateData = (newValue) =>{
        data.container = newValue.container;
        data.blocks = newValue.blocks;
    }
    
    return {
        data,
        formData,
        updateData,
    }
});