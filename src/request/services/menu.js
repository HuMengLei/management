/**
 * @Description: 首页相关接口
 * @Author: 胡梦蕾
 * @Date: 2020-04-21 
 * @LastEditTime: 2020-08-03
 * @LastEditors: 胡梦蕾
 */ 
import { get, post,postFile,postJson,put,putJson,del,delJson} from '../http'
import store from "@/store/index"
const menu={
    // 获取菜单列表
    getMenuList(obj){
        store.commit("common/setAuthKey","menu:list");
        return postJson("/menu/list",obj)
    },
    // 查询用户路由
    getMenuByUser(username){
        store.commit("common/setAuthKey","menu:list");
        return get("/menu/list/"+username)
    },
    // 查询用户权限
    getUserPermissions(obj){
        store.commit("common/setAuthKey","menu:permissions");
        return get("/menu/permissions",obj)
    },
    //新增菜单
	addMenu(obj){
        store.commit("common/setAuthKey","menu:add");
		return postJson("/menu/add",obj)
	},
    //删除菜单
	delMenu(ids){
        store.commit("common/setAuthKey","menu:delete");
		return postJson("/menu/delete/"+ids)
	},
    // 更新菜单
    updateMenu(obj){
        store.commit("common/setAuthKey","menu:update");
        return postJson("/menu/update",obj)
    },
    
}
export default menu 
