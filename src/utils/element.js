
import {
  ElTree, ElMenu, ElMenuItem, ElSubmenu, ElDropdown, ElDropdownMenu, ElDropdownItem,
  ElForm, ElFormItem,ElInput,ElCascader,ElMessageBox,ElMessage, ElTable,ElTableColumn,
  ElPagination, ElLoading, ElRadio, ElTabs, ElTabPane, ElSelect, ElOption
} from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'


const components = [
  ElTree, ElMenu, ElMenuItem, ElSubmenu, ElDropdown,
  ElDropdownMenu, ElDropdownItem, ElForm, ElFormItem,ElInput,
  ElCascader,ElTable,ElTableColumn,ElPagination,ElLoading,ElRadio,
  ElTabs,ElTabPane,ElSelect,ElOption
];

const methods = [
  {name:'$msgBox',value:ElMessageBox},
  {name:'$message',value:ElMessage },
  {name:'$loading',value:ElLoading },
];


export default (Vue) => {
  components.forEach(item => {
     Vue.use(item);
  })
  methods.forEach(item => {
    Vue.config.globalProperties[item.name]=item.value;
  })
}