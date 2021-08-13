import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import initElement from './utils/element'
import "@/assets/styles/public.scss";
import "@/assets/styles/el-style.scss";
import "@/icons/index.js";
import api from './request/api'



const app = createApp(App);

app.config.globalProperties.$api = api;
app.config.globalProperties.$isHavePerms=(info)=>{
      return store.getters.isHavePerms(info)
};

// 公共组件都注册为全局组件
const requireComponent = require.context(
    // 其组件目录的相对路径
    './components',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)
    // 获取组件的 PascalCase 命名
    const componentName = componentConfig.default.name;
    console.log(componentConfig)
    // 全局注册组件
    app.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
})

// 按需引入elementui
initElement(app)
// 设置element-plus的语言为中文
import lang from "element-plus/lib/locale/lang/zh-cn"
import "dayjs/locale/zh-cn"
import locale from "element-plus/lib/locale"
locale.use(lang)


// 挂载
app.use(store).use(router).mount('#app');
