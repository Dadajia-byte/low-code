import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./global.scss"

import "element-plus/dist/index.css";
const pinia = createPinia();
createApp(App).use(pinia).mount("#app");

// 1. 先构造假数据，可以根据假数据渲染页面
// 2. 配置组件对应的映射关系 （preview：xxx，render：xxx）
