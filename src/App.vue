<template>
  <div class="app">
    <Editor v-model="state" :formData="formData"></Editor>
  </div>
</template>
<script setup>
import Editor from "./packages/Editor/index.vue"
import data from './data.json'
import './assets/icons/iconfont/iconfont.css'

import { registerConfig as config } from './utils/editorConfig';
const state = ref(data)
provide('config', config)
const formData = ref({
  username:'陈安舒',
  password:'123456'
})

</script>



<style scoped>
.app {
  height: 95vh;
}
</style>
