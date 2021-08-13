<template>
  <div class="home">
   <sidebar :isCollapse="isCollapse" @changeCollapse="(val)=>isCollapse=val"></sidebar>
   <div class="content" :style="isCollapse && 'width:calc(100% - .5rem); margin-left: .5rem;'">
      <header-box></header-box>
      <content-box :isCollapse="isCollapse"></content-box>
   </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import store from "@/store"
import Sidebar from "./sidebar/Sidebar.vue"
import HeaderBox from "./header/index.vue"
import ContentBox from "./contentBox/index.vue"
export default {
  name: 'Home',
  components: {
    Sidebar,HeaderBox,ContentBox
  },
  setup(){
    const isCollapse=ref(false);
    store.dispatch("common/setUserInfo")
    return {
      isCollapse
    }
  },
 
}
</script>
<style lang="scss" scoped>
.home{
  height: 100%;
  color: #ffffff;
  width: 100vw;
  min-width: 700px;
  overflow: auto;
  .content{
    width: calc(100% - 2.5rem);
    margin-left: 2.5rem;
    height: 100%;
    color: #5a5e66;
    flex: 1 1 auto;
    transition: all .28s;
    position: relative;
  }
}
</style>