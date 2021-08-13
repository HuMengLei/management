import { createStore } from 'vuex'
import getters from './getters'

// 加载modules中的文件
let modules={};
// 使用webpack的require.context()遍历所有serve文件
const files = require.context('./modules/', true, /\.js$/);

files.keys().forEach((key) => {
  let keyName=key.match(/(?<=\.\/).*(?=\.js)/);
  //文件名作为对象的key
  modules[keyName] = files(key).default;
});
console.log(modules)



export default createStore({
  modules,
  getters
})
