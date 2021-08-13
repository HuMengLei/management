import menu from "@/request/services/menu"
import dept from "@/request/services/dept"
import role from "@/request/services/role"
const state = {
    subpage: null,
    menuList:[
    //     {id:1,orderNum:'1',label:"名称1",url:"@/views/system/depy/index.vue",type:0,icon:'el-icon-eleme',
    //     children:[{id:11,parentId:1,orderNum:'11',label:"名称11",url:"@/views/system/depy/index.vue",type:0,icon:'el-icon-eleme',
    //     children:[{id:111,parentId:11,orderNum:'11',label:"名称11",url:"@/views/system/depy/index.vue",type:0,icon:'el-icon-eleme',}]}]},
    //    {id:2,orderNum:'2',label:"名称2",url:"@/views/system/depy/index.vue",type:0,icon:'el-icon-eleme',
    //     children:[{id:21,parentId:2,orderNum:'21',label:"名称21",url:"@/views/system/depy/index.vue",type:0,icon:'el-icon-eleme',}]},
     
    ],
    deptList: [
        // {
        //   id: 1,
        //   name: "部门1",
        //   pid: "",
        //   type: "",
        //   url: "",
        //   children: [
        //     { id: 11, name: "部门11", pid: 1, type: "", url: "" },
        //     { id: 12, name: "部门12", pid: 1, type: "", url: "" },
        //     { id: 13, name: "部门13", pid: 1, type: "", url: "" },
        //   ],
        // },
        // {
        //   id: 2,
        //   name: "部门2",
        //   pid: "",
        //   type: "",
        //   url: "",
        //   children: [
        //     { id: 21, name: "部门21", pid: 2, type: "", url: "" },
        //     { id: 22, name: "部门22", pid: 2, type: "", url: "" },
        //     { id: 23, name: "部门23", pid: 2, type: "", url: "" },
        //   ],
        // },
    ],
    roleList:[
        // {roleId:1111,roleName:'名称',createTime:'2020-09012 12:30',remark:'备注信息',ids:[1,2]}
    ]
}
const mutations = {
    setSubpage: (state, data) => {
        state.subpage = data
    },
    setMenuList:(state, data) => {
        state.menuList = data
    },
    setDeptList:(state, data) => {
        state.deptList = data
    },
    setRoleList:(state, data) => {
        state.roleList = data
    },
}
const actions = {
    setMenuList({ commit }) {
        menu.getMenuList({}).then(res => {
            if (res.code == 0) {
                commit('setMenuList', res.data.rows);
            }
        }).catch(res => {
        })
    },
    setDeptList({ commit }) {
        dept.getDeptTree({}).then(res => {
            if (res.code == 0) {
                commit('setDeptList', res.data);
            }
        }).catch(res => {
        })
    },
    setRoleList:({ commit }) => {
        role.getRolePageList({
            page:1,
            size:999
        }).then(res=>{
            if(res.code==0){
                commit('setRoleList', res.data.list);
            }
        }).catch(res => {
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}