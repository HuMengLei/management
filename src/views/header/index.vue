<!--
 * @Descripttion: 顶部个人详情页
 * @Author: humenglei
 * @Date: 2021-06-30 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-01 15:00:41
-->
<template>
  <div class="header">
    <!-- 用户设置相关功能 -->
    <el-dropdown >
      <span class="user-info">
        <img class="user-img" :src="avatar" alt="avatar" />
        <span class="user-name">{{ userInfo.username }}</span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="openCenter">个人中心</el-dropdown-item>
          <el-dropdown-item>系统设置</el-dropdown-item>
          <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 其他 -->
  </div>
</template>

<script>
export default {
  name: "HeaderBox",
  computed:{
    userInfo(){
      return this.$store.state.common.userInfo
    },
    avatar({userInfo}){
      return require(`@/assets/avatar/${userInfo.avatar}`);
    }
  },
  methods:{
    openCenter(){
      this.$store.commit("common/setNavList",{
        type:1,
        navItem:{id:'user:center',iconName: "el-icon-user",name:'个人中心',path:'/personal-center'},
      })
    },
    logout(){
      const vm =this;
      vm.$api.user.logout().then(res=>{
        if(res.code==0){
          window.sessionStorage.removeItem("username");
          window.sessionStorage.removeItem("Authorization");
          vm.$router.replace("/login");
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 0.5rem;
  border-bottom: 0.01rem solid #f1f1f1;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  color: #5a5e66;
  padding: 0 .1rem;
  .user-info {
    height: .5rem;
    display: flex;
    padding: 0 .05rem;
    flex-direction: row;
    align-items: center;
    position: relative;
    &:hover{
      background: #f1f1f1;
    }
  }
  .user-name {
    padding: 0 0.05rem;
  }
  .user-img {
    height: 0.3rem;
    width: 0.3rem;
    border-radius: 100%;
    border: 0.01rem solid #f1f1f1;
    overflow: hidden;
  }
}
</style>