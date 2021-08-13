<!--
 * @Descripttion: 菜单管理
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-29 17:08:36
-->
<template>
<div class="box">
<!-- 功能 -->
  <div class="tool">
    <input type="text" v-model="search" class="input" placeholder="菜单关键字模糊搜索" />
    <button class="btn" @click="getMenuList">搜索</button>
    <button class="btn btn-green" @click="resetTable">重置</button>
    <button class="btn" v-if="$isHavePerms('menu:add')" @click="addMenu">新增</button>
  </div>
  <!-- 主要列表 -->
  <div class="content" ref="tableBox"> 
    <table-box v-if="tableHeight" :operatetion="$isHavePerms('menu:update') || $isHavePerms('menu:delete')"
      :loading="loading" :tableHeight="tableHeight" 
      :columns="columns" :tableData="tableData" 
      :treeProps="{children: 'children', hasChildren: 'hasChildren'}"
    >
       <template v-slot:operatetion="{ info }">
          <button class="btn-tool" v-if="$isHavePerms('menu:update')"  @click="editInfo(info.row)">编辑</button>
          <button class="btn-tool  btn-tool-red" v-if="$isHavePerms('menu:delete')"  @click="delInfo(info.row)">删除</button>
       </template>
    </table-box>
  </div>
 <!-- 编辑表单 -->
 <div v-show="formShow">
   <menu-form v-show="formShow" :menuData="currMenu" :menuList="tableData" @closeForm="formShow=false;currMenu=null" @updataList="getMenuList"></menu-form>
 </div>
 </div>
</template>
<script>
import MenuForm from "./menuForm.vue"
import { ref, reactive, unref ,onMounted, nextTick } from "vue";
import menu from "@/request/services/menu";
import store from "@/store"
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "MenuManage",
  components:{MenuForm},
  setup(){
    const columns=[
        // {id:"1",label:"序号",prop:"orderNum",formatter:null,minWidth:'70'},
        {id:"2",label:"名称",prop:"label",formatter:null,minWidth:'150',},
        {id:"3",label:"类型",formatter:(info)=>{return info.type==0?'菜单':'按钮'},minWidth:'70'},
        {id:"6",label:"权限",prop:"perms",minWidth:'80'},
        {id:"4",label:"图标",formatter:(info)=>{return `<i class="${info.icon}"></i>`},minWidth:'70'},
        {id:"5",label:"url",prop:"path",minWidth:'70'},
        {id:"6",label:"组件",prop:"component",minWidth:'150'},
      ],
      search=ref(null),
      loading=ref(false),
      tableData=reactive([{label:'llllll'},{label:'22222'}]),
      page=ref(1),
      total=ref(0);
    // 获取列表
    const getMenuList=()=>{
      loading.value=true;
      menu.getMenuList({
        search:search.value
      }).then(res=>{
        loading.value=false;
        if(res.code==0){
          tableData=res.data.rows;
          total.value=res.data.total;
          store.commit("system/setMenuList",tableData);
        }
      }).catch(()=>loading.value=false)
    },
    resetTable=()=> {
      search.value = "";
      getMenuList();
    };
    // 表单的相关操作
    let currMenu=ref(null),
      formShow=ref(false);
    const delInfo=(info)=>{
      ElMessageBox.confirm("确定删除此菜单及菜单下的相关数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        menu.delMenu(info.id).then(res=>{
          if(res.code==0){
            getMenuList();
          }else{
            ElMessage({
              type: "error",
              message: " 菜单删除失败",
              offset: 50,
            });
          }
        })
      })
    },
    addMenu=()=>{
      currMenu.value=null;
      formShow.value=true;
    },
    editInfo=(info)=>{
      currMenu.value=info;
      formShow.value=true;
    };
    getMenuList();
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
      formShow,
      currMenu,
      getMenuList,
      resetTable,
      delInfo,
      addMenu,
      editInfo
    }
  },
};
</script>

<style lang="scss" scoped>
.box{
  height: 100%;
  width: 100%;
  overflow: auto;
}
.tool {
  height: 0.6rem;
  width: 100%;
  min-width: 7rem;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 .2rem;
  box-sizing: border-box;
  box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
  .btn{
    margin-left: .15rem;
  }
}
.content{
  height: calc(100% - 0.74rem);
  margin-top: .1rem;
  width: 100%;
  min-width: 7rem;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
  .btn-tool{
    margin: .05rem;
  }
}
</style>
