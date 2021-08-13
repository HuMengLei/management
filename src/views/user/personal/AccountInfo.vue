<!--
 * @Descripttion: 用户个人中心的账号表单
 * @Author: humenglei
 * @Date: 2021-07-16 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 18:29:50
-->
<template>
  <el-form :model="userForm" ref="userFormRef" label-width="100px" class="form">
    <el-form-item label="性别">
      <div class="form-left">
        <el-radio v-model="userForm.sex" label="0">男</el-radio>
        <el-radio v-model="userForm.sex" label="1">女</el-radio>
        <el-radio v-model="userForm.sex" label="2">保密</el-radio>
      </div>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="userForm.mobile" placeholder="请输入电话"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="部门">
      <el-cascader
        class="dept-cascader"
        placeholder="模糊搜索部门"
        :props="defaultProps"
        :options="deptList"
        v-model="userForm.deptId"
        filterable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="个人描述">
      <el-input
        v-model="userForm.description"
        type="textarea"
        :rows="2"
      ></el-input>
    </el-form-item>
    <div class="form-left">
      <button class="btn" @click.prevent="submitForm">修改信息</button>
    </div>
  </el-form>
</template>

<script>
import {ref,reactive,unref,computed} from 'vue'
import user from "@/request/services/user"
import {ElMessage} from 'element-plus'
import router from "@/router"
import store from "@/store"
export default {
  name: "AccountInfo",
  setup(){
    const userForm=reactive({...store.state.common.userInfo}),
    defaultProps={
        children: "children",
        label: "name",
        value:'id',
        checkStrictly: true
    };
    
    const deptList=computed(()=>store.state.system.deptList),
          deptObj=computed(()=>store.getters.deptObj);
    if(deptList.length==0){
        store.dispatch("system/setDeptList");
    }
    const userFormRef=ref(null);
    const submitForm=()=>{
      const form =unref(userFormRef);
      form.validate((valid) => {
        if (valid) {
           userForm.deptName=deptObj[userForm.deptId];
           user.updateUser(userForm).then(res=>{
              if(res.code==0){
                store.commit("common/setUserInfo",{...userForm});
                ElMessage({
                  type: "success",
                  message: "用户信息修改成功",
                  offset: 50,
                 });
              }else{
                  ElMessage({
                  type: "error",
                  message: "用户信息修改失败",
                  offset: 50,
                 });
              }
            })
        }
      });
    }
    return{
      userForm,
      defaultProps,
      deptList,
      deptObj,
      userFormRef,
      submitForm
    }
  },
 
};
</script>

<style lang="scss" scoped>
.form-left{
    text-align: left;
    .btn{
        margin-left: 100px;
    }
}
</style>