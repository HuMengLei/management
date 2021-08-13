<!--
 * @Descripttion: 用户头像选择框
 * @Author: humenglei
 * @Date: 2021-07-12 13:55:23
 * @LastEditors: humenglei
 * @LastEditTime: 2021-08-13 10:02:59
-->
<template>
  <form-box
    @closeBox="
      $emit('closeBox');
      currAvatar = null;
    "
  >
    <template v-slot:title> 选择头像 </template>
    <template v-slot:content>
      <div class="avatar-wrap">
        <div class="avatar-box">
          <img
            v-for="(item, index) in avatarList"
            :key="index"
            :class="['avatar', currAvatar == item && 'active']"
            @click.prevent="currAvatar = item"
            :src="avatar(item)"
          />
        </div>
        <div class="btn-box">
          <button class="btn" @click="submitIcon">确定</button>
        </div>
      </div>
    </template>
  </form-box>
</template>

<script>
import { ref, computed } from "vue";
import store from "@/store";
import { ElMessage } from "element-plus";
export default {
  name: "AvatarBox",
  setup(props,{emit}) {
    const currAvatar = ref(null);
    const avatarList = computed(() => store.state.common.avatarList);

    const avatar = (a) => {
        return require(`@/assets/avatar/${a}`);
      },
      submitIcon = () => {
        if (currAvatar.value) {
          emit("selectAvatar", currAvatar.value);
          currAvatar.value = null;
        } else {
          ElMessage({
            type: "warning",
            message: "请选择头像",
            offset: 50,
          });
        }
      };
    return {
      currAvatar,
      avatarList,
      avatar,
      submitIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.avatar-wrap {
  position: relative;
  padding: 0.1rem 0.2rem 0.8rem 0.2rem;
  width: 7.3rem;
}
.avatar-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 5rem;
  overflow: auto;
  .avatar {
    border: 1px solid #e4e7ed;
    border-radius: 0.02rem;
    height: 0.9rem;
    width: 0.9rem;
    margin: 0.05rem;
    cursor: pointer;
  }
  .active {
    border: 0.02rem solid $color-blue;
    box-shadow: 0 0 0.1rem $color-blue;
  }
}
.btn-box {
  position: absolute;
  right: 0.2rem;
  bottom: 0.25rem;
}
</style>