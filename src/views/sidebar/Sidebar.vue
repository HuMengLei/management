<!--
 * @Descripttion: 侧边栏
 * @Author: humenglei
 * @Date: 2021-06-30 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-01 15:00:41
-->
<template>
  <div class="sidebar" :style="isCollapse ? 'width:.5rem':'width:2.5rem'">
    <div class="sidebar-top">
      <h1 class="system-title" v-show="!isCollapse">管理系统</h1>
      <button class="btn-icon" @click="isCollapse=!isCollapse;">
        <svg-icon icon-class="menu"></svg-icon>
      </button>
    </div>
    <div class="sidebar-list"></div>
    <el-menu
      class="el-menu-custom"
      @select="selectMenu"
      background-color="#272c33"
      text-color="#fff"
      active-text-color="$color-blue"
      :default-active="defaultActive"
      :collapse="isCollapse">
      <el-submenu v-for="(management,index) in  menu" :key="management.id" :index="index+''">
        <template #title>
          <i :class="management.iconName"></i>
          <span>{{management.name}}</span>
        </template>
        <el-menu-item v-for="item in  management.children" :index="item.path" :key="item.id" >
          <i :class="item.iconName"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {ref, reactive,watch,computed } from 'vue'
import store from "@/store"
import { useRoute } from 'vue-router'
export default {
  name: "Sidebar",
  props:{
    isCollapse:Boolean
  },
  setup(props,{emit}){
    // 侧边栏收缩展开
    let isCollapse=ref(props.isCollapse);
    watch(isCollapse,(nV, oV) => {
        emit("changeCollapse",nV)
    });
    // 全部菜单，根据权限筛选展示的菜单;
    const allMenu=[
        { id: "system", name: "系统管理", iconName: "el-icon-set-up", children: [
            {id:'user:list',iconName: "el-icon-user",name:'用户管理',path:'/user'},
            {id:'role:list',iconName: "el-icon-guide",name:'角色管理',path:'/role'},
            {id:'menu:list',iconName: "el-icon-postcard",name:'菜单管理',path:'/menu'},
            {id:'org:list',iconName: "el-icon-bank-card",name:'部门管理',path:'/dept'},
            {id:'log:list',iconName: "el-icon-chat-line-square",name:'系统日志',path:'/systemlog'},
            {id:'black:list',iconName: "el-icon-tickets",name:'黑名单',path:'/blacklist'}
        ] },
    ];
    let menuObj={};
    let menu=reactive([]);
    allMenu.forEach(list=>{
      let children=[]
      list.children.forEach(item=>{
          let isHavePerms=store.getters.isHavePerms(item.id);
          if(isHavePerms){
            children.push({...item});
            menuObj[item.path]=item;
          }
      })
      menu.push({
          id:list.id,
          name:list.name,
          iconName:list.iconName,
          children
      })
    })
    // 菜单选中的默认选项
    const defaultActive=computed(()=>{
      if(useRoute().path=="/"){
        return null
      }else{
        return useRoute().path
      }
    })
    return{
      isCollapse,
      menuObj,
      menu,
      defaultActive
    }
  },
  methods:{
    selectMenu(info){
      console.log(info)
      const index=info.indexOf("/");
      index>-1 &&
      this.$store.commit("common/setNavList",{
         type:1,
         navItem:this.menuObj[info],
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 2.5rem;
  height: 100%;
  background: #272c33;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  &-top {
    display: flex;
    flex-direction: row;
    padding: .2rem .15rem  ;
    justify-content: space-between;
    align-items: flex-end;
  }
  .system-title{
    font-size: .18rem;
    padding-left: .1rem;
  }
  .el-menu-custom{
    
  }
}
</style>