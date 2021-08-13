<!--
 * @Descripttion: 黑名单管理-表单
 * @Author: humenglei
 * @Date: 2021-07-20 
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:16:59
-->
<template>
  <div class="form-box">
    <h1 class="form-title">新增</h1>
    <el-form
      :model="ipForm"
      :rules="rules"
      ref="ipFormRef"
      label-width="100px"
      class="form"
    >
      <el-form-item label="ip" prop="ip">
        <el-input v-model="ipForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="ipForm.remark" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item>
        <button
          class="btn"
          :disabled="!$isHavePerms('role:add')"
          :style="
            $isHavePerms('role:add')
              ? ''
              : 'background:#999;cursor: not-allowed;'
          "
          @click.prevent="submitForm"
        >
          新增
        </button>
        <button
          class="btn"
          style="margin-right: 10px"
          @click.prevent="cancelForm"
        >
          取消
        </button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, unref  } from "vue";
import blacklist from "@/request/services/blacklist";
import { ElMessage } from "element-plus";
export default {
  name: "IpForm",
  setup(props,{emit}) {
    const defaultProps ={
        children: "children",
        label: "label",
        value: "id",
        checkStrictly: true,
      },
      ipFormRef=ref(null),
      rules ={
        ip: [{ required: true, message: "请输入ip", trigger: "blur" }],
      };
    let ipForm = reactive({
        ip: null,
        remark: null,
      });
    const submitForm=()=>{
      const form = unref(ipFormRef);
      form.validate((valid) => {
        if (valid) {
          blacklist.addBlacklist(ipForm).then((res) => {
            if (res.code == 0) {
              emit('updataTable');
              cancelForm();
              ElMessage({
                type: "success",
                message: "黑名单新增成功",
                offset: 50,
              });
            } else {
              ElMessage({
                type: "error",
                message: "黑名单新增成功",
                offset: 50,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm=()=>{
      const form = unref(ipFormRef);
      form.resetFields();
      ipForm.ip = null;
      ipForm.remark = null;
    };
    return{
      defaultProps,
      ipFormRef,
      ipForm,
      rules,
      submitForm,
      cancelForm
    }
  },
};
</script>

<style lang="scss" scoped>
.form-box {
  height: 100%;
  width: 49%;
  min-width: 300px;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 0.05rem rgba(198, 205, 249, 0.47);
  .form-title {
    line-height: 0.5rem;
    padding: 0 0.2rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: 0.15rem;
    text-align: left;
  }
  .form {
    padding: 0.2rem;
  }
  .btn {
    float: right;
  }
}
</style>