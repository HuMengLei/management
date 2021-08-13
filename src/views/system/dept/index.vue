<!--
 * @Descripttion: 部门管理
 * @Author: humenglei
 * @Date: 2021-07-01 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:17:11
-->
<template>
<div class="box">
 <div class="list">
    <div class="list-tool">
      <input
        type="text"
        v-model="search"
        class="input"
        placeholder="部门关键字模糊搜索"
      />
      <button class="btn" @click="beginFilterTree">搜索</button> 
      <button class="btn btn-green" @click="resetTree">重置</button>
    </div>
    <el-tree ref="deptTree"
      :data="deptList" 
      :props="defaultProps"
      :filter-node-method="filterNode">
      <template #default="{ node, data }">
        <div class="custom-tree-node" >
          <p>{{ node.label }}</p>
          <div>
             <button class="btn-simple" v-if="$isHavePerms('org:update')" @click.stop="editNode(data)">编辑</button>
             <button class="btn-simple" v-if="$isHavePerms('org:delete')" @click.stop="delNode(data)">删除</button>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
  <div class="form-box">
    <h1 class="form-title">{{btnText}}</h1>
    <el-form :model="deptForm" :rules="rules" ref="deptFormRef" label-width="100px" class="form">
      <el-form-item label="上级部门" >
        <el-cascader class="dept-cascader"
          placeholder="模糊搜索"
          :props="defaultProps"
          :options="deptList"
          v-model="deptForm.parentId"
          filterable clearable></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name"></el-input>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="deptForm.remark" type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <button class="btn" :style="isHaveEditPerms()"  @click.prevent="submitForm">{{btnText}}</button>
        <button class="btn" :style="isHaveEditPerms()" style="margin-right:10px" @click.prevent="cancelForm">取消</button>
      </el-form-item>
    </el-form>
  </div>
</div>
  
</template>

<script>
import { ref, reactive, unref } from "vue";
import dept from "@/request/services/dept";
import store from "@/store"
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "DeptManage",
  setup(){
    const btnText=ref('新增'),
      defaultProps={
        children: "children",
        label: "name",
        value:'id',
        checkStrictly: true
      },
      deptList=reactive([]),
      search=ref('');
    // 获取部门树结构列表
    const getDeptList=()=>{
      dept.getDeptTree({
        search:search.value
      }).then(res=>{
        if(res.code==0){
          deptList=res.data;
          store.commit("system/setDeptList",deptList);
        }
      })
    }
    getDeptList();
    // 根据搜索内容对树进行筛选
    const deptTree=ref(null),
    beginFilterTree=()=>{
      const tree=unref(deptTree)
      tree.filter(search.value);
    },
    // 重置部门树
    resetTree=()=>{
      search.value = "";
      beginFilterTree();
    };

    //部门表单增删改部门的相关数据
    let currEditDept={};
    const deptForm=reactive({
        id:null,
        name:null,
        parentId:null,
        remark:null
    }),
    deptFormRef=ref(null),
    rules={
        name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
    };
    //部门表单增删改部门的相关方法 
    const editNode=(info)=>{
      currEditDept=info;
      for(let key in deptForm){
        deptForm[key]=info[key];
      }
      btnText.value='编辑';
    },
    delNode=(info)=>{
      ElMessageBox.confirm("确定删除此部门及部门下的相关数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        dept.delDept({
          id:info.id
        }).then(res=>{
          if(res.code==0){
            const tree=unref(deptTree);
            tree.remove(info.id);
            getDeptList();
          }else{
            ElMessage({
              type: "error",
              message: "部门删除失败",
              offset: 50,
            });
          }
        })
      })
    },
    cancelForm=()=>{
      const form=unref(deptFormRef);
      form.resetFields();
      currEditDept={};
      for(let key in deptForm){
        deptForm[key]=null;
      }
      btnText.value='新增';
    },
    submitForm=()=>{
      if(deptForm.id && (!store.getters.isHavePerms("org:update"))){
        return
      }
      if(!deptForm.id && (!store.getters.isHavePerms("org:add"))){
        return
      }
      const form=unref(deptFormRef);
      form.validate((valid) => {
          if (valid) {
            
            if( Array.isArray(deptForm.parentId) ){
              deptForm.parentId=deptForm.parentId[deptForm.parentId.length-1];
            }
            if(deptForm.id){ 
              dept.editDept(deptForm).then(res=>{
                if(res.code==0){
                   currEditDept.name=deptForm.name;
                   currEditDept.remark=deptForm.remark;
                   cancelForm();
                }
              })
            }else{
              dept.addDept(deptForm).then(res=>{
                if(res.code==0){
                  const tree=unref(deptTree);
                  tree.append({
                    ...deptForm,
                    id:res.data,
                  },deptForm.parentId);
                  cancelForm();
                  getDeptList();
                }
              })
            }
            btnText.value='新增'
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    };
    return {
      btnText,
      defaultProps,
      deptList,
      search,
      deptTree,
      deptForm,
      deptFormRef,
      rules,
      getDeptList,
      beginFilterTree,
      resetTree,
      editNode,
      delNode,
      cancelForm,
      submitForm
    }
  },
  methods: {
    isHaveEditPerms(){
      const vm =this;
      if(vm.deptForm.id && (!vm.$isHavePerms("org:update"))){
        return 'background:#999;cursor: not-allowed;'
      }
      if(!vm.deptForm.id && (!vm.$isHavePerms("org:add"))){
        return 'background:#999;cursor: not-allowed;'
      }
      return ''
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    
  },
};
</script>

<style lang="scss" scoped>
.box{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
}
.list {
  height: 100%;
  width: 50%;
  min-width: 400px;
  background: #fff;
  box-sizing: border-box;
  padding: 0.2rem;
  margin-right: .1rem;
  box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
  &-tool {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.2rem;
    > * {
      margin-right: 0.15rem;
    }
  }
  .custom-tree-node{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    >p{
      width: 80%;
      text-align: left;
    }
  }
}
.form-box {
  height: 100%;
  width: 49%;
  min-width: 400px;
  background: #fff;
  box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
  .form-title{
    line-height: .5rem;
    padding: 0 .2rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: .15rem;
    text-align: left;
  }
  .form{
    padding: .2rem;
  }
  .btn{
    float: right;
  }
  
}
</style>