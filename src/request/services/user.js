/**
 * @Description: 账号接口
 * @Author: 胡梦蕾
 * @Date: 2020-04-21 
 * @LastEditTime: 2020-08-03
 * @LastEditors: 胡梦蕾
 */ 
import { get, post,getFile,postJson,put,putJson,del,delJson} from '../http'
import store from "@/store/index"
const user={
	// 登录
    login(obj){
		store.commit("common/setAuthKey","admin_001");
		return postJson('/login/check',obj)
	},
	getCaptcha(){
		store.commit("common/setAuthKey","");
		return getFile('/captcha')
	},
	// 注销
	logout(){
		store.commit("common/setAuthKey","login_002");
		return get('/login/logout')
	},
	//获取用户信息
	getCurrentUser(){
		store.commit("common/setAuthKey","user:info");
		return get('/user/getCurrentUser')
	},
	//获取用户列表
	getUserList(obj){
		store.commit("common/setAuthKey","user:list");
		return postJson("/user/list",obj)
	},
	//新增用户
	addUser(obj){
		store.commit("common/setAuthKey","user:add");
		return postJson("/user/add",obj)
	},
	//校验用户名
	checkUserName(name){
		store.commit("common/setAuthKey","user:check");
		return get("/user/check/"+name)
	},
	//删除用户
	delUser(userIds){
		store.commit("common/setAuthKey","user:delete");
		return postJson("/user/delete/"+userIds)
	},
	// 更新用户
	updateUser(obj){
		store.commit("common/setAuthKey","user:update");
		return postJson("/user/update",obj)
	},
	// 更新用户头像
	updateUserAvatar(obj){
		store.commit("common/setAuthKey","user:update_avatar");
		return get("/user/update/avatar",obj)
	},
	// 更新用户密码
	updateUserPassword(obj){
		store.commit("common/setAuthKey","user:password");
		return get("/user/password",obj)
	},
	// 校验用户密码
	checkUserPassword(obj){
		store.commit("common/setAuthKey","user:password_check");
		return get("/user/password/check",obj)
	},
	// 重置用户密码
	resetPassword(obj){
		store.commit("common/setAuthKey","user:reset");
		return get("/user/password/reset",obj)
	},
	
}
export default user
