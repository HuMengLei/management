import { get, post,postFile,postJson,put,putJson,del,delJson} from '../http'
import store from "@/store/index"
const dept={
    // 获取部门树
    getDeptTree(obj){
        store.commit("common/setAuthKey","org:list");
        return postJson("/org/tree",obj)
    },
    //新增部门
	addDept(obj){
        store.commit("common/setAuthKey","org:add");
		return postJson("/org/add",obj)
	},
    //删除部门
	delDept(obj){
        store.commit("common/setAuthKey","org:delete");
		return postJson("/org/delete",obj)
	},
    // 更新部门
    editDept(obj){
        store.commit("common/setAuthKey","org:update");
        return postJson("/org/edit",obj)
    },
    
}
export default dept 