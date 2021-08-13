<!--
 * @Description: 黑名单主要内容
 * @Version: 1.0
 * @Autor: humenglei
 * @Date: 2021-07-22 09:45:32
 * @LastEditors: humenglei
 * @LastEditTime: 2021-07-28 17:16:43
-->
<template>
  <div class="box">
    <div class="list">
      <!-- 功能 -->
      <div class="tool">
        <input
          type="text"
          v-model="search"
          class="input"
          placeholder="角色关键字模糊搜索"
        />
        <button class="btn" @click="getList">搜索</button>
        <button class="btn btn-green" @click="resetTable">重置</button>
        <button
          class="btn"
          v-if="$isHavePerms('blackList:delete')"
          @click="delInfo(null)"
        >
          删除
        </button>
      </div>
      <!-- 主要列表 -->
      <div class="content" ref="tableBox">
        <table-box
          v-if="tableHeight"
          :selection="true"
          @handleSelectionChange="handleSelectionChange"
          :loading="loading"
          :tableHeight="tableHeight"
          :columns="columns"
          :tableData="tableData"
          :page="page"
          :size="20"
          :total="total"
          @handleChangePage="handleChangePage"
        >
        </table-box>
      </div>
    </div>
    <!-- 编辑表单 -->
    <ip-form @updataTable="getList"></ip-form>
  </div>
</template>

<script>
import IpForm from "./IpForm.vue";
import { ref, reactive, unref, onMounted, nextTick } from "vue";
import blacklist from "@/request/services/blacklist";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "BlackList",
  components: { IpForm },
  setup() {
    const search = ref(null),
      loading = ref(false),
      tableBox = ref(null),
      page = ref(1),
      total = ref(0),
      columns =[
        { id: "1", label: "IP", prop: "ip", formatter: null, minWidth: "100" },
        { id: "2", label: "备注", prop: "remark",formatter: null, minWidth: "150" },
      ],
      tableData = reactive([]);

    // 获取列表
    const getList = () => {
      loading.value = true;
      blacklist
        .getBlacklist({
          page: page,
          size: 20,
          search: search,
        })
        .then((res) => {
          loading.value = false;
          if (res.code == 0) {
            tableData = res.data.list;
            total.value = res.data.total;
          }
        })
        .catch(() => (loading.value = false));
    };

    // 页码改变
    const handleChangePage = (pageVal) => {
      page.value = pageVal;
      getList();
    };

    // 选中项进行删除操作
    let selectIds = [];
    const handleSelectionChange = (info) => {
        selectIds = info.map((item) => item.id);
      },
      delInfo = (info) => {
        const vm = this;
        if (!info && selectIds.length == 0) {
          ElMessage({
            type: "warning",
            message: "请选择要删除的对象",
            offset: 50,
          });
          return;
        }
        ElMessageBox.confirm("确定删除所勾选的ip？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let delId = selectIds.join(",");
          blacklist
            .delBlacklist({
              ids: delId,
            })
            .then((res) => {
              if (res.code == 0) {
                getList();
              } else {
                ElMessage({
                  type: "error",
                  message: "ip删除失败",
                  offset: 50,
                });
              }
            });
        });
      };

    // 重置表格
    const resetTable = () => {
      search.value = "";
      getList();
    };

    getList();
    let tableHeight = ref(null);
    onMounted(() => {
      nextTick(
        () => (tableHeight.value = unref(tableBox).clientHeight - 70 + "px")
      );
    });
    return {
      search,
      loading,
      tableHeight,
      tableBox,
      columns,
      tableData,
      page,
      total,
      getList,
      resetTable,
      handleSelectionChange,
      handleChangePage,
      delInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
  .list {
    height: 100%;
    width: 50%;
    min-width: 550px;
    background: #fff;
    box-shadow: 0 0 0.05rem rgba(198, 205, 249, 0.47);
    margin-right: 0.1rem;
  }
}

.tool {
  height: 0.6rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.2rem;
  box-sizing: border-box;
  .btn {
    margin-left: 0.15rem;
    flex: 0 0 auto;
  }
}
.content {
  height: calc(100% - 0.74rem);
  margin-top: 0.1rem;
  width: 100%;
  box-sizing: border-box;
  .btn-tool {
    margin: 0.05rem;
  }
}
</style>