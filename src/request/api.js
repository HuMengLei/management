/**
 * @Description: 接口api
 * @Author: 胡梦蕾
 * @Date: 2020-04-21 
 * @LastEditTime: 2020-08-03
 * @LastEditors: 胡梦蕾
 */ 
let config={};

// 使用webpack的require.context()遍历所有serve文件
const files = require.context('./services/', true, /\.js$/);

files.keys().forEach((key) => {
  let keyName=key.match(/(?<=\.\/).*(?=\.js)/);
  //文件名作为对象的key
  config[keyName] = files(key).default;
});

// 导出接口
export default config