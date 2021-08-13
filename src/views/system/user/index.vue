<!--
 * @Descripttion: 用户管理
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 20:00:55
-->
<template>
<div class="box">
<!-- 功能 -->
  <div class="tool">
    <input type="text" v-model="search" class="input" placeholder="菜单关键字模糊搜索" />
    <button class="btn" @click="getList">搜索</button>
    <button class="btn btn-green" @click="resetTable">重置</button>
    <button class="btn" v-if="$isHavePerms('user:add')" @click="addUser">新增</button>
    <button class="btn" v-if="$isHavePerms('user:delete')" @click="delInfo(null)">删除</button>
    <!-- <el-dropdown>
      <button class="btn btn-white">更多</button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="delInfo(null)">删除</el-dropdown-item>
          <el-dropdown-item @click="addUser">新增</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
  </div>
  <!-- 主要列表 -->
  <div class="content" ref="tableBox"> 
    <table-box  :operatetion="$isHavePerms('user:update')||$isHavePerms('user:reset')||$isHavePerms('user:delete')"
      :selection="true" @handleSelectionChange="handleSelectionChange"  
      :loading="loading" :tableHeight="tableHeight" 
      :columns="columns" :tableData="tableData"
      :page="page" :size="20" :total="total"
    >
       <template v-slot:operatetion="{ info }">
          <button class="btn-tool" v-if="$isHavePerms('user:update')"  @click="editInfo(info.row)">编辑</button>
          <button class="btn-tool btn-tool-orange" v-if="$isHavePerms('user:reset')"  @click="resetPwd(info.row)">重置密码</button>
          <button class="btn-tool btn-tool-red" v-if="$isHavePerms('user:delete')"  @click="delInfo(info.row)">删除</button>
       </template>
    </table-box>
  </div>
 <!-- 编辑表单 -->
 <div v-show="formShow">
   <user-form v-show="formShow" :userData="currUser"  @closeForm="formShow=false;currUser=null"></user-form>
 </div>
  </div>
</template>
<script>
import UserForm from "./userForm.vue"
export default {
  name: "UserManage",
  components:{UserForm},
  data() {
    return {
      search: null,
      formShow:false,
      currUser:null,
      loading:false,
      tableHeight:null,
      columns:[
        {id:"1",label:"用户名",prop:"username",formatter:null,minWidth:'100'},
        {id:"2",label:"性别",formatter:(info)=>{
          if(info.sex==0){
            return `<span  style="color:#409EFF"><i class="el-icon-female"></i><span>男</span></span>`
          }else if(info.sex==1){
            return `<span style="color:#f8038a"><i class="el-icon-male"></i><span>女</span></span>`
          }else{
            return `<span style="color:#666666">保密</span>`
          }
        },minWidth:'70'},
        {id:"3",label:"邮箱",prop:"email",minWidth:'100'},
        {id:"4",label:"部门",prop:"deptName",minWidth:'120'},
      ],
      tableData:[
        // {userId:1,username:'1111',sex:0,email:'1242434@qq.com',deptName:'xxx部门',},
        // {userId:2,username:'2222',sex:1,email:'78798809@qq.com',deptName:'xxx部门',},
        // {userId:3,username:'333',sex:2,email:'43435456@qq.com',deptName:'xxx部门',}
      ],
      page:1,
      total:0,
      selectIds:[]
    };
  },
  created(){
    this.getList();
  },
  mounted(){
    const vm =this;
    vm.$nextTick(()=>{
      vm.tableHeight=vm.$refs.tableBox.clientHeight - 70 +'px';
    })
  },
  methods:{
    getList(){
      const vm =this;
      vm.$api.user.getUserList({
        search:vm.search
      }).then(res=>{
        if(res.code==0){
          vm.tableData=res.data.list;
          vm.total=res.data.total;
        }
      })
    },
    resetTable() {
      this.search = "";
      this.getList();
    },
    handleSelectionChange(info){
      this.selectIds=info.map(item=>item.userId)
    },
    delInfo(info){
      const vm =this;
      if(!info && vm.selectIds.length==0){
        vm.$message({
              type: "warning",
              message: "请选择用户",
              offset: 50,
        });
        return
      }
      vm.$msgBox.confirm("确定删除此用户？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        let delId='';
        if(info){
          delId=info.userId;
        }else{
          delId=vm.selectIds.join(",");
        }
        vm.$api.user.delUser(delId).then(res=>{
          if(res.code==0){
            vm.getList();
          }else{
            vm.$message({
              type: "error",
              message: " 菜单删除失败",
              offset: 50,
            });
          }
        })
      })
    },
    addUser(info){
      this.currUser=null;
      this.formShow=true;
    },
    editInfo(info){
      this.currUser=info;
      this.formShow=true;
    },
    // 重置密码
    resetPwd(info){
      const vm =this;
      vm.$msgBox.confirm("确定重置此用户密码？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        vm.$api.user.resetPassword({
          usernames:info.username
        }).then(res=>{
          if(res.code==0){
            vm.$message({
              type: "success",
              message:info.username+" 密码重置成功，用户密码为:123456",
              offset: 50,
              showClose: true,
              duration:0
            });
          }else{
            vm.$message({
              type: "error",
              message: info.username+" 密码重置失败",
              offset: 50,
            });
          }
        })
      })
    }
  }
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
