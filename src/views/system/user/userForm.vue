<!--
 * @Descripttion: 用户管理-表单
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-14 15:00:41
-->
<template>
  <form-box @closeBox="cancelForm('userForm')">
    <template v-slot:title>
       {{title}}
    </template>
    <template v-slot:content>
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="头像" > 
          <div class="form-avatar">
            <img :src="avatar" />
            <span @click="iconBoxShow=true">更新头像</span>
          </div>
        </el-form-item>
        <el-form-item label="性别" class="form-line">
           <div class="form-radio">
            <el-radio v-model="userForm.sex" label="0">男</el-radio>
            <el-radio v-model="userForm.sex" label="1">女</el-radio>
            <el-radio v-model="userForm.sex" label="2">保密</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="电话" >
          <el-input v-model="userForm.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="部门"  prop="deptId">
          <el-cascader class="dept-cascader"
            placeholder="模糊搜索部门"
            :props="defaultProps"
            :options="deptList"
            v-model="userForm.deptId"

            filterable clearable></el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色">
            <el-option :checkStrictly="true"
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userForm.userId">
          <el-input v-model="userForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!userForm.userId">
          <el-input v-model="userForm.confirmPassword" show-password placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="个人描述" class="form-line">
          <el-input v-model="userForm.description" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <div class="form-line">
          <button class="btn" @click.prevent="submitForm('userForm')">确定</button>
        </div>
      </el-form>
    </template>
  </form-box>
  <avatar-box v-show="iconBoxShow" @closeBox="iconBoxShow=false" @selectAvatar="selectAvatar"></avatar-box>
</template>

<script>
import  AvatarBox from "./AvatarBox.vue"
export default {
    name:'UserForm',
    props:{
      userData:Object
    },
    components:{AvatarBox},
    data(){
      // 确认密码验证
			let validatePwd = (rule, value, callback) => {
				if (this.userForm.password !== '' && this.userForm.confirmPassword === '') {
					callback(new Error("请确认密码"));
				} else if (this.userForm.confirmPassword !== this.userForm.password) {
					callback(new Error("密码输入不一致"));
				} else {
					callback();
				}
			};
      return{
        iconBoxShow:false,
        title:'新增用户',
        defaultProps:{
          children: "children",
          label: "name",
          value:'id',
          checkStrictly: true
        },
        userForm:{
          avatar:"1d22f3e41d284f50b2c8fc32e0788698.jpeg",
          deptId:null,
          deptName:null,
          description:null,//描述
          email:null,
          mobile:null,//联系电话
          password:'',
          confirmPassword:'',
          roleId:null,
          roleName:null,
          sex:"2",//0男，1女，2保密
          username:null//用户名
        },
        rules:{
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
          ],
          roleId:[
            { required: true, message: '请选择用户角色', trigger: 'change' },
          ],
          deptId:[
            { required: true, message: '请选择部门', trigger: 'change' },
          ],
          password: [{
						required: true,
						message: "请输入密码",
						trigger: 'blur'
					}],
					confirmPassword: [{
						validator: validatePwd,
						trigger: 'blur'
					}],
        }
      }
    },
    computed:{
      deptList(){
          return this.$store.state.system.deptList
      },
      deptObj(){
        return this.$store.getters.deptObj
      },
      roleList(){
          return this.$store.state.system.roleList
      },
      roleObj(){
        return this.$store.getters.roleObj
      },
      avatar({userForm}) {
        return require(`@/assets/avatar/${userForm.avatar}`);
      }
    },
    created(){
      if(this.deptList.length==0){
        this.$store.dispatch("system/setDeptList");
      }
      if(this.roleList.length==0){
        this.$store.dispatch("system/setRoleList");
      }
    },
    watch:{
      userData(nV){
        if(nV){
          this.title="编辑用户";
          this.userForm={...nV};
        }
      },
    },
    methods:{
      submitForm(formName){
        const vm =this;
       vm.$refs[formName].validate((valid) => {
          if (valid) {
            if( Array.isArray(vm.userForm.deptId) ){
              vm.userForm.deptId=vm.userForm.deptId[vm.userForm.deptId.length-1];
            }
            vm.userForm.roleName=vm.roleObj[vm.userForm.roleId];
            vm.userForm.deptName=vm.deptObj[vm.userForm.deptId];
            if(vm.userForm.userId){
              vm.userForm.password=null;
              vm.$api.user.updateUser(vm.userForm).then(res=>{
                if(res.code==0){
                   vm.$parent.getList();
                   vm.cancelForm(formName);
                }else{
                  vm.$message({
                  type: "error",
                  message: "用户更新失败:"+res.msg,
                  offset: 50,
                 });
                }
              })
            }else{
              vm.$api.user.addUser(vm.userForm).then(res=>{
                if(res.code==0){
                  vm.$parent.getList();
                  vm.cancelForm(formName);
                }else{
                  vm.$message({
                  type: "error",
                  message: "用户新增失败:"+res.msg,
                  offset: 50,
                 });
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelForm(formName){
        this.$emit('closeForm');
        this.$refs[formName].resetFields();
        this.title="新增用户";
        this.userForm={
          avatar:null,
          deptId:null,
          deptName:null,
          description:null,//描述
          email:null,
          mobile:null,//联系电话
          password:'',
          confirmPassword:'',
          roleId:null,
          roleName:null,
          sex:"2",//0男，1女，2保密
          username:null,//用户名
        };
      },
      selectAvatar(avatar){
        this.userForm.avatar=avatar;
        this.iconBoxShow=false;
      }
    }
}
</script>

<style lang="scss" scoped>
.form{
  padding: .2rem .4rem .2rem .2rem;
  width: 7rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  >div{
    width: 50%;
  }
  >.form-line{
    width: 100%;
  }
  .form-avatar{
    position: absolute;
    height: .9rem;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    z-index: 9;
    >img{
      height: 100%;
      width: .9rem;
      border: 1px solid #DCDFE6;
    }
    >span{
      color:$color-blue ;
      cursor: pointer;
      padding: 0 0 0 .1rem;
      line-height: .2rem;
    }
  }
  &-radio{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
  }
}
</style>