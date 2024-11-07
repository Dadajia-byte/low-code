<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import Editor from "./packages/Editor/index.vue"
import './assets/icons/iconfont/iconfont.css'
import { registerConfig as config } from './utils/EditorConfig';
provide('config', config)


</script>



<style >
.app {
  height: 100vh;
}

</style>
