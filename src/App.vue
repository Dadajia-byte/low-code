<template>
<div class="app">
  <Editor v-model="state"></Editor>
</div>
</template>
<script setup>
import data from './data.json'
import {provide, ref} from "vue"
import Editor from "./packages/editor.vue"
import {registerConfig as config}  from './utils/EditorConfig';
const state = ref(data)
provide('config',config)


</script>



<style scoped>
.app {
  
  height: 95vh;

}
</style>
