import { get, post,postFile,postJson,put,putJson,del,delJson} from '../http'
import store from "@/store/index"

// IP黑名单相关接口
const blacklist={
    // 获取黑名单列表
    getBlacklist(obj){
        store.commit("common/setAuthKey","blackList:list");
        return postJson("/blackList/list",obj)
    },
    //新增黑名单
	addBlacklist(obj){
        store.commit("common/setAuthKey","blackList:add");
		return postJson("/blackList/add",obj)
	},
    //删除黑名单
	delBlacklist(obj){
        store.commit("common/setAuthKey","blackList:delete");
		return postJson("/blackList/delete",obj)
	},
}
export default blacklist 