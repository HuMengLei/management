


function createDeptObj(list,res){
    list.forEach(item=>{
        res[item.id]=item.name;
        if(item.children){
            createDeptObj(item.children,res)
        }
    })
}

const getters = {
    isHavePerms: (state) => (perms) => {
        if(state.common.permissions.length==0){
            return true;
        }
        let index=state.common.permissions.indexOf(perms);
        return index>-1 ? true : false
    },
    roleObj:(state) =>{
        let result={};
        state.system.roleList.forEach(item=>{
            result[item.roleId]=item.roleName;
        })
        return result
    },
    deptObj:(state) =>{
        let result={};
        createDeptObj(state.system.deptList,result);
        return result
        
    },
}
export default getters