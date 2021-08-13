<!--
 * @Descripttion: 菜单管理-表单
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 19:30:33
-->
<template>
  <div class="form-box">
    <h1 class="form-title">{{ btnText }}</h1>
    <el-form
      :model="roleForm"
      :rules="rules"
      ref="roleFormRef"
      label-width="100px"
      class="form"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="roleForm.remark"
          type="textarea"
          :rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tree ref="menuTreeRef" v-if="menuList.length"
          :data="menuList" node-key="id"
          :props="defaultProps" :default-expand-all="true"
          show-checkbox :check-strictly="true"
          :default-checked-keys="roleForm.menuIds"
          @check-change="handleCheckChange"
        ></el-tree>
        <!-- <el-cascader class="dept-cascader"
          placeholder="模糊搜索"
          :props="defaultProps"
          :options="menuList"
          v-model="roleForm.menuIds"
         clearable></el-cascader>
        </el-form-item> -->
      </el-form-item>
      <el-form-item>
        <button class="btn" :style="isHaveEditPerms()" @click.prevent="submitForm">
          {{ btnText }}
        </button>
        <button
          class="btn" 
          style="margin-right: 10px"
          @click.prevent="cancelForm"
        >
          取消
        </button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, unref ,onMounted, nextTick, watch } from "vue";
import role from "@/request/services/role";
import store from "@/store"
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "RoleForm",
  props: {
    roleData: Object,
    menuList: Array,
  },
  setup(props,{emit}){
    const btnText=ref('新增'),
      defaultProps= {
        children: "children",
        label: "label",
        value: "id",
        checkStrictly: true,
      },
      rules={
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      roleForm=reactive( {
        roleId:null,
        roleName: null,
        remark: null,
        menuIds: [],
      }),
      roleFormRef=ref(null),
      menuTreeRef=ref(null);
    watch(()=>props.roleData,(nV)=>{
       if (nV) {
        btnText.value = "编辑";
        for(let key in roleForm){
            roleForm[key]=nV[key];
        }
        roleForm.menuIds= nV.menuIds ? nV.menuIds.split(","):[];
      }
    })

   const handleCheckChange=(data, checked)=> {
      if(checked){
        roleForm.menuIds.push(data.id)
      }else{
        let index =roleForm.menuIds.indexOf(data.id);
        roleForm.menuIds.splice(index,1);
      }
    },
    submitForm=()=>{
      const vm = this;
      const form =unref(roleFormRef);
      form.validate((valid) => {
        if (valid) {
          if (roleForm.roleId) {
            role.updateRole({
              ...roleForm,
              menuIds:roleForm.menuIds.join(",")
            }).then((res) => {
              if (res.code == 0) {
                emit("updataList");
                cancelForm();
               ElMessage({
                  type: "success",
                  message: "角色更新成功",
                  offset: 50,
                });
              } else {
                ElMessage({
                  type: "error",
                  message: "角色更新失败",
                  offset: 50,
                });
              }
            });
          } else {
            role.addRole({
              ...roleForm,
              menuIds:roleForm.menuIds.join(",")
            }).then((res) => {
              if (res.code == 0) {
                emit("updataList");
                cancelForm();
                ElMessage({
                  type: "success",
                  message: "角色新增成功",
                  offset: 50,
                });
              } else {
                ElMessage({
                  type: "error",
                  message: "角色新增失败",
                  offset: 50,
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm=()=>{
      emit("closeForm");
      const form =unref(roleFormRef);
      form.resetFields();
      btnText.value = "新增";
      const menuTree=unref(menuTreeRef)
      menuTree.setCheckedKeys([])
      roleForm.id=null;
      roleForm.roleName=null;
      roleForm.remark=null;
      roleForm.menuIds=[];
    };
    return {
        btnText,
        defaultProps,
        rules,
        roleForm,
        roleFormRef,
        menuTreeRef,
        handleCheckChange,
        submitForm,
        cancelForm
    }
  },
  methods: {
    isHaveEditPerms(){
      const vm =this;
      if(vm.roleForm.roleId && (!vm.$isHavePerms("role:update"))){
        return 'background:#999;cursor: not-allowed;'
      }
      if(!vm.roleForm.roleId && (!vm.$isHavePerms("role:add"))){
        return 'background:#999;cursor: not-allowed;'
      }
      return ''
    },
  },
};
</script>

<style lang="scss" scoped>
.form-box {
  height: 100%;
  width: 39%;
  min-width: 300px;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 0.05rem rgba(198, 205, 249, 0.47);
  .form-title {
    line-height: 0.5rem;
    padding: 0 0.2rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: 0.15rem;
    text-align: left;
  }
  .form {
    padding: 0.2rem;
  }
  .btn {
    float: right;
  }
}
</style>