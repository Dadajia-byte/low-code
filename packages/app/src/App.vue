<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import './assets/icons/iconfont/iconfont.css'
// import {registerConfig as config} from './utils/EditorConfig';
import { registerConfig as config} from './materials/index'
provide('config', config)
console.log(config);


</script>


<style>
.app {
  height: 100vh;
}

</style>
