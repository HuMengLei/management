<!--
 * @Description: 主要内容
 * @Version: 1.0
 * @Autor: humenglei
 * @Date: 2021-06-30 09:45:32
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-27 16:02:57
-->
<template>
  <nav class="nav">
    <scroll-bar>
      <div class="nav-box">
        <!-- 菜单列表 -->
        <div  ref="navList"
          v-for="(navItem, index) in navList"
          :key="navItem.id"
          :class="['nav-item', currMenu == navItem.path && 'nav-curr']"
          @mouseenter="hoverPath = navItem.path"
          @mouseleave="hoverPath = null"
          @contextmenu.prevent="openMenuBox($event,navItem,index)"
        > 
          <span @click="switchContent(navItem)">{{ navItem.name }}</span>
          <i
            class="el-icon-close"
            @click="closePath(navItem, index)"
            :style=" closeStyle(navItem)
            "
          ></i>
        </div>
      </div>
    </scroll-bar>
  </nav>
  <ul v-show="visible" class="contextmenu" :style="menuStyle">
      <li @click="closePath(currPath,currPathIndex)">关闭当前</li>
      <li @click="closeOtherPath(currPath,currPathIndex)">关闭其他</li>
      <li @click="closeAllPath">关闭所有</li>
  </ul>
  <div class="page">
    <router-view />
  </div>
  <div id="system-c">© Copyright 福建省亿力信息技术有限公司 制作维护</div>
</template>

<script>
import { ref,reactive,watch,computed} from 'vue'
import store from "@/store"
import ScrollBar from "./ScrollBar.vue"
import router from "@/router"
import { useRoute } from 'vue-router'
export default {
  name: "ContentBox",
  components:{ScrollBar},
  props:{
    isCollapse:Boolean
  },
  setup(props){
    // 右键菜单的显示和隐藏;
    let visible=ref(false),
    menuStyle=ref('display:none;'),
    currPath=reactive({}),
    currPathIndex=ref(null),
    hoverPath=ref('');
    const closeMenu=()=>{visible.value = false; }
    watch(visible,(nV)=>{
      if (nV) {
        document.body.addEventListener("click", closeMenu);
      } else {
        document.body.removeEventListener("click", closeMenu);
      }
    })
    // 显示右键菜单时设置所选中的菜单项
    const openMenuBox=(e,path,index)=>{
      let isCollapse=props.isCollapse,
          width=document.body.clientWidth;
      if(e.clientX+110 >width){
        menuStyle.value= `top:${e.clientY+5}px;right:${width - e.clientX - 5}px`
      }else{
        menuStyle.value=isCollapse ? 
             `top:${e.clientY+5}px;left:calc(${e.clientX}px - .5rem)`:
             `top:${e.clientY+5}px;left:calc(${e.clientX}px - 2.5rem)`;
      }
      currPath=path,
      currPathIndex.value=index,
      visible.value = true;
    };
    // 导航菜单列表和当前路由
    let navList = computed(() => store.state.common.navList);
    let currMenu = computed(() => useRoute().path);
    const switchContent=(navItem)=>{
      router.replace(navItem.path);
    };
    return{
      visible,
      menuStyle,
      currPath,
      currPathIndex,
      hoverPath,
      navList,
      currMenu,
      openMenuBox,
      switchContent
    }
  },
  methods: {
    closeStyle(navItem){
      return (navItem.path == this.hoverPath && navItem.path != '/home') ? 'opacity: 1;':''
    },
    closePath(navItem, index) {
      if(index==0) return;
      if (navItem.path == "/homepage") return;
      this.$store.commit("common/setNavList", {
        type: 2,
        navItem: navItem,
        delIndex: index,
      });
    },
    closeOtherPath(navItem, index){
      this.$store.commit("common/setNavList", {
        type: 3,
        navItem: navItem,
        delIndex: index,
      });
    },
    closeAllPath(){
      this.$store.commit("common/setNavList", {
        type: 0,
      });
    },
    
  },
};
</script>

<style lang="scss" scoped>
.nav {
  border-bottom: 0.01rem solid #f1f1f1;
  width: 100%;
  position: relative;
  &-box {
    height: 0.4rem;
    // position: absolute;
    // top: 0;
    // right: 0;
    display: flex;
  }
  &-item {
    padding: 0 0rem 0 0.25rem;
    height: 100%;
    position: relative;
    border-right: 0.01rem solid #f1f1f1;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    > span {
      display: inline-block;
      min-width: 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > i {
      font-size: 0.12rem;
      color: $color-red;
      font-weight: bold;
      transform: scale(0.9);
      padding: 0.05rem;
      opacity: 0;
      cursor: pointer;
      flex: 0 0 auto;
      &:hover {
        color: #f13c3c;
      }
    }
    &:hover {
      color: #303133;
    }
  }
  &-curr::before {
    content: "";
    display: inline-block;
    height: 0.04rem;
    width: 0.04rem;
    border-radius: 0.04rem;
    background: $color-green;
    box-shadow: 0 0 0.04rem $color-green;
    position: absolute;
    left: 0.14rem;
    top: 0.18rem;
  }
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 99;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #333;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  li {
    margin: 0;
    padding: 7px 20px;
    cursor: pointer;
    &:hover {
      background-color: #e8f4ff;
      color: #46a6ff;
    }
  }
}
.page {
  height: calc(100% - 1.25rem);
  width: 100%;
  background: #f3f5f8;
  box-sizing: border-box;
  padding: 0.1rem;
}
#system-c {
  width: 100%;
  line-height: 0.25rem;
  position: absolute;
  bottom: 0;
  text-align: center;
  font-size: 0.12rem;
}

</style>