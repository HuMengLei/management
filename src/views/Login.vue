<template>
  <div class="login">
    <div class="box">
      <h1 class="title">管理后台</h1>
      <el-input placeholder="用户名" v-model="username" ></el-input>
      <el-input placeholder="密码" v-model="password" show-password></el-input>
      <div class="captcha">
        <el-input class="captcha-input" placeholder="验证码" v-model="captchaCode"></el-input>
        <img :src="captchaImg" alt="验证码" @click="getCaptchaImg">
      </div>
      <div class="remember-pwd">
        <input
          type="checkbox"
          id="checkboxRemember"
          ref="checkboxRemember"
          @change="rememberPwdOrNo($event)"
        />
        <span class="remember-pwd-text">记住密码</span>
      </div>
      <button class="btn" @click="toLogin">登录</button>
    </div>
  </div>
</template>

<script>
import { toRefs,ref, reactive,watch,computed } from 'vue'
import user from "@/request/services/user"
import {ElMessage} from 'element-plus'
import router from "@/router"
export default {
  name: "Login",
  setup(){
    let loginForm=reactive({
      username:null,
      password:null,
      captchaCode:null,
    })
    let captchaImg=ref(),captcha=ref();
    // 获取验证码
    user.getCaptcha().then(res=>{
        let url=window.URL.createObjectURL(res.data);
        captchaImg.value=url;
        captcha.value=res.headers.captcha;
    })
    // 登录
    const toLogin=()=>{
      console.log(loginForm)
      if(!loginForm.username || loginForm.username.trim()==""){
        ElMessage({
            type: "warning",
            message: "请输入用户名",
            offset: 50,
        });
        return
      }
      if(!loginForm.password || loginForm.password.trim()==""){
        ElMessage({
            type: "warning",
            message: "请输入密码",
            offset: 50,
        });
        return
      }
      window.sessionStorage.setItem("username", loginForm.username);
      router.replace("/");
      return
      user.login({
        ...loginForm,
        captcha:captcha.value,
      }).then(res=>{
        if(res.code==0){
          window.sessionStorage.setItem("username", loginForm.username);
          window.sessionStorage.setItem("Authorization", res.data.Authorization);
          router.replace("/home");
        }else{
          ElMessage({
            type: "error",
            message: res.msg,
            offset: 50,
         });
        }
      }).catch(()=>{
          ElMessage({
            type: "error",
            message: "",
            offset: 50,
         });
      })
    }
    //是否记住密码
    const rememberPwdOrNo=(e)=>{
      if (e.target.checked) {
        window.localStorage.setItem("a", loginForm.username);
        window.localStorage.setItem("p", loginForm.password);
      } else {
        window.localStorage.removeItem("a");
        window.localStorage.removeItem("p");
      }
    };
    return {
      captchaImg,
      captcha,
      ...toRefs(loginForm),
      toLogin,
      rememberPwdOrNo,
    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  background: url("../assets/imgs/login_bg.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  padding: 0.2rem 0.5rem 0.5rem;
  width: 3.5rem;
  height: 3.6rem;
  margin-left: 30%;
  background: #ffffff;
  border-radius: 0.1rem;
  box-shadow: 0 0 0.2rem #c4d9fd;
  display: flex;
  flex-direction: column;
  >*{
    margin-top: .2rem;
  }
  .captcha{
    display: flex;
    justify-content: space-between;
    &>.captcha-input{
      width: 58%;
    }
    &>img{
      width: 40%;
      height: .45rem;
      cursor: pointer;
    }
  }
  .title{
    font-size: .3rem;
    line-height: .4rem;
    letter-spacing: .01rem;
  }
  .remember-pwd {
  font-size: 14px;
  text-align: start;
  margin-top:.1rem;
  }

.remember-pwd-text {
  display: inline-block;
  vertical-align: text-top;
  line-height: 14px;
  margin-left: 5px;
}
  .btn{
    border-radius: .06rem;
    height: .5rem;
    font-size: .18rem;
  }
}
</style>