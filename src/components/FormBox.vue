<!--
 * @Descripttion: 表单模板
 * @Author: humenglei
 * @Date: 2021-07-12 10:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-12 15:00:41
-->
<template>
  <div class="shade" ref="wrap">
    <div class="box" ref="box">
      <div class="top" @mousedown="dragForm($event)">
          <h1 class="box-title"><slot name="title"></slot></h1>
          <button class="btn-icon" @click="$emit('closeBox')"><i class="el-icon-close"></i></button>
      </div>
       <slot name="content">
       </slot>
    </div>
  </div>
</template>

<script>
export default {
   name:'FormBox',
   methods:{
    //中心框随着表单移动
    dragForm(e) {
      let vm = this;
      let box = vm.$refs.box,
        wrap = vm.$refs.wrap;
      // 侧边栏宽度73px和顶部高度77px
    
      //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
      let divx = e.clientX - box.getBoundingClientRect().left,
          divy = e.clientY - box.getBoundingClientRect().top,
          wrapLeft=wrap.getBoundingClientRect().left,
          wrapTop=wrap.getBoundingClientRect().top;
    
      //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div（.form_wrap），使用vm.$refs.formWrap
      wrap.onmousemove = function(e) {
        //获取移动后div的位置：鼠标位置-divx/divy
        var l = e.clientX - divx - wrapLeft;
        var t = e.clientY - divy - wrapTop;
        box.style.left = l + "px";
        box.style.top = t + "px";
      };
      wrap.onmouseup = function(e) {
        wrap.onmousemove = null;
        wrap.onmouseup = null;
      };
    }
   }
}
</script>

<style lang="scss" scoped>

</style>