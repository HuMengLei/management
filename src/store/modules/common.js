/*
 * @Description: 公共仓库
 * @Version: 1.0
 * @Autor: humenglei
 * @Date: 2021-07-22 09:45:32
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-27 16:01:12
 */
import router from '@/router'
import user from "@/request/services/user"
// // 加载modules中的文件
 let avatars=[];
// 使用webpack的require.context()遍历所有serve文件
const files = require.context('@/assets/avatar/', true);

console.log(files.keys())
files.keys().forEach((key) => {
   
  let keyName=key.match(/(?<=\.\/).*/);
  //文件名作为对象的key
  avatars.push(keyName[0])
  
});

const state = {
    authKey:null,
    avatarList:avatars,
    navList: [
        { id: '1', name: "首页", path: '/home' },
    ],
    currMenu:'1',
    permissions:[],
    userInfo:{
        avatar:"1d22f3e41d284f50b2c8fc32e0788698.jpeg",
        deptId:1,
        deptName:null,
        description:null,//描述
        email:null,
        mobile:null,//联系电话
        roleId:null,
        /**
         * @description: 
         * @param {*}
         * @return {*}
         */
        roleName:null,
        sex:"2",//0男，1女，2保密
        username:'用户名'//用户名
    },
}
const mutations = {
    setAuthKey:(state, data) => {
        state.authKey=data;
    },
    setPermissions:(state, data) => {
        state.permissions=data;
    },
    setNavList: (state, data) => {
        console.log("路由",router)
        switch (data.type) {
            case 0://清空
                state.navList = [{ id: '1', name: "首页", path: '/home' }];
                router.replace('/home');
                state.currMenu='1';
                break;
            case 1: //新增
                let index=state.navList.findIndex(item=>{return item.id==data.navItem.id}) || -1;
                if(index==-1){
                    state.navList.push(data.navItem);
                    
                }
                router.replace(data.navItem.path);
                state.currMenu=data.navItem.id;
                break;
            case 2://删除
                let currRouter=router.currentRoute.value.path;
                if(currRouter==data.navItem.path){
                    router.replace(state.navList[data.delIndex-1].path);
                    state.currMenu=state.navList[data.delIndex-1].id;
                }
                state.navList.splice(data.delIndex,1);
                break;
            case 3://删除其他
                state.navList =data.navItem.id==1 ? [
                    { id: '1', name: "首页", path: '/home' },
                ]:[
                    { id: '1', name: "首页", path: '/home' },
                    {...data.navItem}
                ];
                router.replace(data.navItem.path);
                state.currMenu=data.navItem.id;
                break;
            default:
                break;
        }
    },
    setUserInfo:(state, data) => {
        state.userInfo=data;
    },
}

const actions = {

    setUserInfo({ commit }) {
        user.getCurrentUser().then(res => {
            if (res.code == 0) {
                commit('setUserInfo', res.data);
            }
        }).catch(res => {
        }
        )
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}