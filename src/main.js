// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from "vue";
import App from "/src/App.vue";
import router from "/src/router/index.js";
import store from "/src/store/index.js";
import installElementPlus from "/src/plugins/element.js";
import "/src/assets/css/icon.css";
import "/src/permission.js";
import ColorPicker from "colorpicker-v3"; // 注册组件
import "colorpicker-v3/style.css"; // 引入样式文件

const app = createApp(App);
installElementPlus(app); //国际化
app.use(store).use(router).use(ColorPicker).mount("#app");
