<!--
 * @Descripttion: 用户个人中心的密码修改
 * @Author: humenglei
 * @Date: 2021-07-16 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:17:45
-->
<template>
  <el-form
    :model="passwordForm"
    :rules="rules"
    ref="pswForm"
    label-width="100px"
    class="form"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="passwordForm.oldPassword"
        show-password
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="passwordForm.newPassword"
        show-password
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="passwordForm.confirmPassword"
        show-password
        placeholder="请确认密码"
      ></el-input>
    </el-form-item>
    <div class="form-left">
      <button class="btn" @click.prevent="submitForm">
        修改密码
      </button>
    </div>
  </el-form>
</template>

<script>
import {ref,reactive,unref} from 'vue'
import user from "@/request/services/user"
import {ElMessage} from 'element-plus'
import router from "@/router"
import store from "@/store"
export default {
  name: "PasswordInfo",
  setup(){
    const pswForm=ref(null);
    const passwordForm=reactive({
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
    })
    // 确认密码验证
    const validatePwd = (rule, value, callback) => {
      if (
        passwordForm.confirmPassword !== passwordForm.newPassword
      ) {
        callback(new Error("密码输入不一致"));
      } else {
        callback();
      }
    };
    const rules={
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "请确认密码",
            trigger: "blur",
          },
          {
            validator: validatePwd,
            trigger: "blur",
          },
        ],
    };
    const submitForm=()=>{
      const form = unref(pswForm);
      console.log("form:",form);
      form.validate(async(valid) => {
        if (valid) {
           let res =await user.checkUserPassword({ password:passwordForm.oldPassword}); 
           if(res.code!=0){
             ElMessage({
               type: "error",
               message: "用户密码验证失败",
               offset: 50,
             });
             return
           }
           let updateRes=await user.updateUserPassword({ password:passwordForm.newPassword});
           if(updateRes.code!=0){
             ElMessage({
               type: "error",
               message: "用户密码修改失败",
               offset: 50,
             });
           }else{
             ElMessage({
               type: "success",
               message: "用户密码修改成功,请重新登录",
               offset: 50,
             });
             router.push("/login");
             window.sessionStorage.removeItem("username");
             store.commit("common/setToken",null); 
           }
        }
      });
    }
    return {
      pswForm,
      passwordForm,
      rules,
      submitForm
    }
  },
};
</script>

<style lang="scss" scoped>
.form-left {
  text-align: left;
  .btn {
    margin-left: 100px;
  }
}
</style>