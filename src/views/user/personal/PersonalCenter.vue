<!--
 * @Descripttion: 用户个人中心
 * @Author: humenglei
 * @Date: 2021-07-15 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:17:35
-->
<template>
  <div class="box">
    <div class="info">
      <h1 class="info-top">
        关于我
      </h1>
      <div class="user" >
        <div class="user-avatar">
          <img :src="avatar" alt="用户头像" >
          <div class="user-avatar-change" @click="avatarBoxShow=true">更换头像</div>
        </div>
        <p class="user-name">{{userInfo.username}} · {{userInfo.roleName}}</p>
      </div>
      <div class="info-describe">
        <h1 class="info-describe-title">个人描述</h1>
        <p class="info-describe-text">{{userInfo.description || '这家伙很懒，什么都没有留下。'}}</p>
      </div>
    </div>
    <div class="func">
      <el-tabs v-model="currNav" >
        <el-tab-pane
          v-for="item in nav"
          :key="item.id"
          :label="item.name"
          :name="item.id"
          ></el-tab-pane
        >
      </el-tabs>
      <account-info v-show="currNav==1" ></account-info>
      <password-info v-show="currNav==2"></password-info>
    </div>
  </div>
  <avatar-box v-show="avatarBoxShow" @closeBox="avatarBoxShow=false" @selectAvatar="selectAvatar"></avatar-box>
</template>

<script>
import AccountInfo from "./AccountInfo.vue"
import PasswordInfo from "./PasswordInfo.vue"
import AvatarBox from "../../system/user/AvatarBox.vue"
import { ref,computed} from 'vue'
import store from "@/store"
export default {
  name: "PersonalCenter",
  components:{AccountInfo,PasswordInfo,AvatarBox},
  setup(){
    let avatarBoxShow=ref(false),
      nav=[
        { id: "1", name: "账号信息" },
        { id: "2", name: "个人密码" },
      ],
      currNav=ref("1");
    
    let userInfo= computed({
       get: ()=>store.state.common.userInfo,
       set: val => {
         store.commit("common/setUserInfo",val);
       }
    });
    let avatar=computed(()=> require(`@/assets/avatar/${userInfo.value.avatar}`));
    return{
      avatarBoxShow,nav,currNav,userInfo,avatar
    }
  },
  methods:{
    selectAvatar(info){
      const vm =this;
      vm.avatarBoxShow=false;
      vm.$api.user.updateUserAvatar({
        avatar:info
      }).then(res=>{
        if(res.code==0){
          vm.$message({
            type: "success",
            message: "头像更新成功",
            offset: 50, 
          });
          vm.userInfo={
            ...vm.userInfo,
            avatar:info
          };
        }else{
          vm.$message({
            type: "error",
            message: "头像更新失败",
            offset: 50,
          });
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.box{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .info{
    width: 39%;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
    box-sizing: border-box;
  }
  .func{
    width: 60%;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 .05rem rgba(198, 205, 249, 0.47);
    box-sizing: border-box;
    padding: .2rem;
  }
}
.info{
  &-top{
    line-height: .6rem;
    padding: 0 .2rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: .15rem;
    font-weight: normal;
    text-align: left;
  }
  &-describe{
    padding: 0 .2rem;
  }
  &-describe-title{
    line-height: .4rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: .14rem;
    text-align: left;
  }
  &-describe-text{
    text-align: left;
    padding: .05rem;
    line-height: .25rem;
    white-space: normal;
    word-break: break-all;
  }
}
.user{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: .5rem 0;
  &-name{
    line-height: .4rem;
  }

  &-avatar{
    position: relative;
    height: 1rem;
    width: 1rem;
    border-radius: 1rem;
    
    >img{
      position: absolute;
       height: 100%;
       width: 100%;
       border-radius: 1rem;
       top: 0;
       left:calc(50% - .5rem) ;
       transition: all .5s;
    }
    &:hover>img{
       transform: rotate(-45deg) translate(0rem,.5rem);
       top: 0;
       left:calc(50% - .5rem) ;
    }
  }
  &-avatar-change{
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    border:.05rem solid #cccccc;
    box-sizing: border-box;
    padding: .1rem 0;
    color: $color-blue;
    cursor: pointer;
    &:hover{
      font-weight: bold;
    }
  }
}
</style>