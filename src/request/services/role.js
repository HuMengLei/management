import { get, post,postFile,postJson,put,putJson,del,delJson} from '../http'
import store from "@/store/index"
const role={
    // 获取角色列表
    getRoleList(obj){
        store.commit("common/setAuthKey","role:list");
        return get("/role/list",obj)
    },
    // 获取角色分页列表
    getRolePageList(obj){
        store.commit("common/setAuthKey","role:page");
        return postJson("/role/page",obj)
    },
    //新增角色
	addRole(obj){
        store.commit("common/setAuthKey","role:add");
		return postJson("/role/add",obj)
	},
    // 校验角色名
    checkRoleName(name){
        store.commit("common/setAuthKey","role:check");
        return get("/role/check/"+name)
    },
    //删除角色
	delRole(ids){
        store.commit("common/setAuthKey","role:delete");
		return postJson("/role/delete/"+ids)
	},
    // 更新角色
    updateRole(obj){
        store.commit("common/setAuthKey","role:update");
        return postJson("/role/update",obj)
    },
    
}
export default role 