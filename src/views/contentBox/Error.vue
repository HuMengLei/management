<!--
 * @Description: 错误404页面
 * @Version: 1.0
 * @Autor: humenglei
 * @Date: 2021-07-22 09:45:32
 * @LastEditors: humenglei
 * @LastEditTime: 2021-08-13 10:02:13
-->
<template>
  <div class="box">
    <p>404</p>
  </div>
</template>

<script>
export default {
    name:'Error'
}
</script>

<style lang="scss" scoped>
.box{
    height: 100%;
    width: 100%;
    background: #fff;
    
    padding-top: 1rem;
    box-sizing: border-box;
    
    
  >p{
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: .03rem;
    background: linear-gradient(to bottom, $color-blue, #a1c9f0, $color-blue);
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>