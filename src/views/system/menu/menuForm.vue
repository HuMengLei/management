<!--
 * @Descripttion: 菜单管理-表单
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-29 16:58:42
-->
<template>

  <form-box @closeBox="cancelForm()">
    <template v-slot:title>
       {{title}}
    </template>
    <template v-slot:content>
      <el-form :model="menuForm" :rules="rules" ref="menuFormRef" label-width="100px" class="form">
        <el-form-item label="上级菜单" >
          <el-cascader class="dept-cascader"
            placeholder="模糊搜索"
            :props="defaultProps"
            :options="menuList"
            v-model="menuForm.parentId"
            filterable clearable></el-cascader>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="序号" >
          <el-input v-model="menuForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="类型" >
          <div class="form-radio">
            <el-radio v-model="menuForm.type" label="0">菜单</el-radio>
            <el-radio v-model="menuForm.type" label="1">按钮</el-radio>
          </div>
        </el-form-item>
        
        <el-form-item label="图标" v-show="menuForm.type==0">
          <el-input v-model="menuForm.icon">
              <template #append>
                <button @click.prevent="openIconBox">
                   <i class="el-icon-picture-outline-round"></i>
                </button>
              </template>
          </el-input>
        </el-form-item>
        <el-form-item label="URL" v-show="menuForm.type==0">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item label="组件" v-show="menuForm.type==0">
          <el-input v-model="menuForm.component"></el-input>
        </el-form-item>
        <el-form-item label="权限" >
          <el-input v-model="menuForm.perms"></el-input>
        </el-form-item>
        <div>
          <button class="btn" @click.prevent="submitForm">确定</button>
        </div>
      </el-form>
    </template>
  </form-box>
  <icon-box v-show="iconBoxShow" @closeBox="iconBoxShow=false" @selectIcon="selectIcon"></icon-box>

</template>

<script>
import IconBox from "./IconBox.vue"
import { ref, reactive, unref ,watch } from "vue";
import menu from "@/request/services/menu";
import { ElMessage } from "element-plus";
export default {
    name:'MenuForm',
    components:{IconBox},
    props:{
      menuList:Array,
      menuData:Object
    },
    setup(props,{emit}){
      const title=ref('新增菜单'),
      defaultProps={
          children: "children",
          label: "label",
          value:'id',
          checkStrictly: true
        },
      menuForm=reactive({
          menuId:null,
          parentId:null,
          orderNum:null,
          menuName:null,
          perms:null,
          url:null,
          path:null,
          component:null,
          type:'0',
        }),
      rules={
        menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
      };
      watch(()=>props.menuData,(nV)=>{
        if(nV){
          title.value="编辑菜单";
          for(let key in menuForm){
            menuForm[key]=nV[key];
          }
          menuForm.menuName=nV.label,
          menuForm.menuId=nV.id;
        }
      })
      const iconBoxShow=ref(false),
      // 打开icon图标集合框
      openIconBox=()=>{iconBoxShow.value=true;},
      // 选择图标
      selectIcon=(iconName)=>{
        menuForm.icon=iconName;
        iconBoxShow.value=false;
      };
      const menuFormRef=ref(null),
      submitForm=()=>{
        const form =unref(menuFormRef);
        form.validate((valid) => {
          if (valid) {
            if( Array.isArray(menuForm.parentId) ){
              menuForm.parentId=menuForm.parentId[menuForm.parentId.length-1];
            }
            if(menuForm.menuId){
              menu.updateMenu(menuForm).then(res=>{
                if(res.code==0){
                   emit("updataList");
                   cancelForm();
                }else{
                 ElMessage({
                  type: "error",
                  message: "菜单更新失败",
                  offset: 50,
                 });
                }
              })
            }else{
              menu.addMenu(menuForm).then(res=>{
                if(res.code==0){
                  emit("updataList");
                  cancelForm(formName);
                }else{
                  ElMessage({
                  type: "error",
                  message: "菜单新增失败",
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
      cancelForm=()=>{
        const form =unref(menuFormRef);
        form.resetFields();
        title.value="新增菜单";
        for(let key in menuForm){
          let val=null;
          if(key=='type'){
            val=0;
          }
          menuForm[key]=val;
        }
        emit('closeForm');
      };
      return{
        title,
        defaultProps,
        menuForm,
        rules,
        iconBoxShow,
        menuFormRef,
        openIconBox,
        selectIcon,
        submitForm,
        cancelForm
      }
    },
}
</script>

<style lang="scss" scoped>
.form{
  padding: .2rem .4rem .2rem .2rem;
  width: 7rem;
  box-sizing: border-box;
  &-radio{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
  }
}
</style>