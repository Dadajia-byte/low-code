<template>
  <div class="app">
    <Editor v-model="state"></Editor>
  </div>
</template>
<script setup>
import Editor from "./packages/Editor/index.vue"
import data from './data.json'
import './assets/icons/iconfont/iconfont.css'

import { registerConfig as config } from './utils/editorConfig';
const state = ref(data)
provide('config', config)


</script>



<style scoped>
.app {
  height: 95vh;
}
</style>
