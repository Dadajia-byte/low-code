import { defineStore } from "pinia";
export  const useEditorDataStore = defineStore("editorDataStore",()=>{
    const data = ref({});
    const formData = reactive({})

    return {
        data,
        formData
    }
});