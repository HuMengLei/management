<!--
 * @Descripttion: 角色管理
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 19:30:52
-->
<template>
<div class="box">
<div class="list">
  <!-- 功能 -->
  <div class="tool">
    <input type="text" v-model="search" class="input" placeholder="角色关键字模糊搜索" />
    <button class="btn" @click="getList">搜索</button>
    <button class="btn btn-green" @click="resetTable">重置</button>
    <button class="btn" v-if="$isHavePerms('role:delete')" @click="delInfo(null)" >删除</button>
  </div>
  <!-- 主要列表 -->
  <div class="content" ref="tableBox"> 
    <table-box v-if="tableHeight" :operatetion="$isHavePerms('role:update') || $isHavePerms('role:delete')"
      :selection="true" @handleSelectionChange="handleSelectionChange"  
      :loading="loading" :tableHeight="tableHeight"
      :columns="columns" :tableData="tableData" 
      :page="page" :size="20" :total="total">
       <template v-slot:operatetion="{ info }">
          <button class="btn-tool" v-if="$isHavePerms('role:update')"  @click="editInfo(info.row)">编辑</button>
          <button class="btn-tool btn-tool-red" v-if="$isHavePerms('role:delete')"  @click="delInfo(info.row)">删除</button>
       </template>
    </table-box>
  </div>
</div>
 <!-- 编辑表单 -->
<role-form  :roleData="currRole" :menuList="menuList" @updataList="getList"  @closeForm="currRole=null"></role-form>
</div>

</template>

<script>
import RoleForm from "./RoleForm.vue"
import { ref, reactive, unref ,computed,onMounted, nextTick } from "vue";
import role from "@/request/services/role";
import store from "@/store"
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name:'RoleManage',
  components:{RoleForm},
  setup(){
    const columns=[
        {id:"1",label:"角色名称",prop:"roleName",formatter:null,minWidth:'100'},
        {id:"2",label:"备注",prop:"remark",formatter:null,minWidth:'150'},
        {id:"6",label:"创建时间",prop:"createTime",minWidth:'80'},
      ],
      search=ref(null),
      loading=ref(false),
      tableData=reactive([]),
      page=ref(1),
      total=ref(0);
    // 菜单列表
    const menuList= computed(()=>store.state.system.menuList);
    if(menuList.length==0){
      store.dispatch("system/setMenuList");
    };
    // 获取角色列表
    const getList=()=>{
      loading.value=true;
      role.getRolePageList({
        page:vm.page,
        size:20,
        search:vm.search
      }).then(res=>{
        loading.value=false;
        if(res.code==0){
          vm.tableData=res.data.list;
          vm.total=res.data.total;
        }
      }).catch(()=>loading.value=false)
    },
    // 重置表格
    resetTable=()=> {
      search.value = "";
      getList();
    };
    // 增删改操作
    let selectIds=[];
    const currRole=ref(null),
    handleSelectionChange=(info)=>{
      selectIds=info.map(item=>item.roleId)
    },
    delInfo=(info)=>{
      if(!info && selectIds.length==0){
        ElMessage({
              type: "warning",
              message: "请选择角色",
              offset: 50,
        });
        return;
      }
      ElMessageBox("确定删除所勾选的角色？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        let delId='';
        if(info){
          delId=info.roleId;
        }else{
          delId=selectIds.join(",");
        }
        role.delRole(delId).then(res=>{
          if(res.code==0){
            getList();
          }else{
            ElMessage({
              type: "error",
              message: "角色删除失败",
              offset: 50,
            });
          }
        })
      })
    },
    addRole=()=>{currRole.value=null},
    editInfo=(info)=>{currRole.value=info};

    let tableHeight = ref(null);
    const tableBox = ref(null);
    onMounted(() => {
      nextTick(
        () => (tableHeight.value = unref(tableBox).clientHeight - 70 + "px")
      );
    });
    return{
      columns,
      search,
      loading,
      tableHeight,
      tableData,
      tableBox,
      page,
      total,
      menuList,
      currRole,
      getList,
      resetTable,
      handleSelectionChange,
      delInfo,
      addRole,
      editInfo
    }
  },
}
</script>

<style lang="scss" scoped>
.box{
  height: 100%; 
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
  .list{
     height: 100%;
     width: 60%;
     min-width: 550px;
    background: #fff;
    box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47); 
    margin-right: .1rem;
  }

}

.tool {
  height: 0.6rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 .2rem;
  box-sizing: border-box;
  .btn{
    margin-left: .15rem;
    flex:  0  0 auto;
  }
}
.content{
  height: calc(100% - 0.74rem);
  margin-top: .1rem;
  width: 100%;
  box-sizing: border-box;
  .btn-tool{
    margin: .05rem;
  }
}
</style>