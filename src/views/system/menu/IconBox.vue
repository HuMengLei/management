<!--
 * @Descripttion: 菜单图标选择框
 * @Author: humenglei
 * @Date: 2021-07-12 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:19:22
-->
<template>
  <form-box @closeBox="$emit('closeBox');currIcon=null">
    <template v-slot:title> 选择图标 </template>
    <template v-slot:content>
    <div class="icon-list">
         <el-tabs v-model="currNav" >
        <el-tab-pane
          v-for="item in nav"
          :key="item.id"
          :label="item.name"
          :name="item.id"
          ></el-tab-pane
        >
      </el-tabs>
      <div class="icon-box">
        <button   v-for="(item, index) in iconList" :key="index"
        :class="['icon',currIcon==item && 'active']"
        @click.prevent="currIcon=item">
          <i :class="item"></i>
        </button>
      </div>
      <div class="btn-box">
        <button class="btn" @click="submitIcon">确定</button>
      </div>
    </div>
     
    </template>
  </form-box>
</template>

<script>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
export default {
  name: "IconBox",
  setup(){
    const nav=[
        { id: "1", name: "线框类" },
        { id: "2", name: "指向类" },
        { id: "3", name: "填充类" },
      ],
      lineIcon=[
          'el-icon-setting','el-icon-user','el-icon-phone-outline','el-icon-more-outline','el-icon-star-off',
          'el-icon-goods','el-icon-help','el-icon-picture-outline-round','el-icon-camera','el-icon-bell',
          'el-icon-finished','el-icon-view','el-icon-c-scale-to-original','el-icon-date','el-icon-folder-opened',
          'el-icon-tickets','el-icon-document-copy','el-icon-printer','el-icon-paperclip','el-icon-monitor',
          'el-icon-attract','el-icon-mobile','el-icon-umbrella','el-icon-scissors','el-icon-headset',
          'el-icon-brush','el-icon-coordinate','el-icon-magic-stick','el-icon-pie-chart','el-icon-reading',
          'el-icon-data-analysis','el-icon-collection-tag','el-icon-suitcase','el-icon-receiving','el-icon-collection',
          'el-icon-notebook-1','el-icon-office-building','el-icon-shopping-cart-full','el-icon-shopping-bag-1','el-icon-box',
          'el-icon-bank-card','el-icon-money','el-icon-coin','el-icon-discount','el-icon-news',
          'el-icon-guide','el-icon-thumb','el-icon-connection','el-icon-set-up','el-icon-postcard',
          'el-icon-position','el-icon-odometer','el-icon-aim','el-icon-copy-document','el-icon-wind-power','el-icon-chat-line-square',
          'el-icon-truck','el-icon-ship','el-icon-basketball','el-icon-service','el-icon-mobile-phone',
      ],
      arrowIcon=[
          'el-icon-d-caret','el-icon-caret-left','el-icon-caret-right','el-icon-caret-bottom','el-icon-caret-top',
          'el-icon-arrow-left','el-icon-arrow-right','el-icon-arrow-down','el-icon-arrow-up','el-icon-d-arrow-left',
          'el-icon-d-arrow-right','el-icon-video-play','el-icon-rank','el-icon-sort',
      ],
      fillIcon=[
          'el-icon-s-tools','el-icon-user-solid','el-icon-phone','el-icon-more','el-icon-star-on',
          'el-icon-s-goods','el-icon-s-help','el-icon-picture','el-icon-upload','el-icon-camera-solid',
          'el-icon-message-solid','el-icon-s-cooperation','el-icon-s-order','el-icon-s-platform','el-icon-s-promotion',
          'el-icon-s-home','el-icon-s-management','el-icon-s-shop','el-icon-s-marketing','el-icon-s-flag',
          'el-icon-s-finance','el-icon-s-custom','el-icon-s-opportunity','el-icon-s-data','el-icon-s-grid',
          'el-icon-menu','el-icon-share'
      ],
      iconList=ref([]),
      currNav=ref("1"),
      currIcon=ref(null);
      watch(currNav,(nV)=>{
        switch(nV){
              case "1":iconList.value=lineIcon;break;
              case "2":iconList.value=arrowIcon;break;
              case '3':iconList.value=fillIcon;break;
              default:break;
        }
      },{immediate: true});

      const submitIcon=()=>{
          if(currIcon.value){
              emit('selectIcon',currIcon.value)
          }else{
             ElMessage({
              type: "warning",
              message: "请选择图标",
              offset: 50,
            });
          }
      };
      return{
        nav,
        iconList,
        currIcon,
        currNav,
        submitIcon
      }
  },
};
</script>

<style lang="scss" scoped>
.icon-list{
    width: 5.1rem;
    padding: .2rem;
    box-sizing: border-box;
    height: 3.5rem;
    position: relative;
}
.icon-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    .icon{
        border: 1px solid #E4E7ED;
        border-radius: .02rem;
        height: .35rem;
        width: .35rem;
        font-size: .22rem;
        color: #303133;
        margin: .02rem;
    }
    .active{
        color: #ffffff;
        background: $color-blue;
    }
}
.btn-box{
    position: absolute;
    right: .2rem;
    bottom: .25rem;
}

</style>