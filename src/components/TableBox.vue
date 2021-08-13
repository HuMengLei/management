<template>
    <!-- 表格 -->
    <el-table v-if="tableHeight"
      v-loading="loading"
      :data="tableData"
      :height="tableHeight" border row-key="id"
      :tree-props="treeProps||{}" 
       @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selection" type="selection" width="40" align="center"></el-table-column>
      <template v-for="col in columns"  :key="col.id">
         <el-table-column  v-if="col.formatter"  show-overflow-tooltip 
           :label="col.label" 
           :min-width="col.minWidth || null" 
          :align="col.align || 'center'">
            <template #default="scope">
            <div  v-html="col.formatter(scope.row,scope.$index)"></div>
            </template>
         </el-table-column>
         <el-table-column  v-else  show-overflow-tooltip 
           :label="col.label" :prop="col.prop"
           :min-width="col.minWidth || null" 
          :align="col.align || 'center'">
         </el-table-column>
        
      </template>
      <el-table-column v-if="operatetion" align="center">
            <template #default="scope">
              <slot name="operatetion" :info="scope"></slot>
            </template>
         </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination style="margin-top:.2rem" v-if="page!=0"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="size"
      background
      layout="total,prev, pager, next,jumper"
      :total="total"
    ></el-pagination>
</template>

<script>
export default {
  name:'TableBox',
  props: {
    treeProps:Object,
    selection:{
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tableHeight:{
      type: String,
      default: '',
    },
    tableData:{
      type:Array,
      default:function(){
        return []
      }
    },
    columns:{
      type:Array,
      default:function(){
        return []
      }
    },
    page:{
       type:Number,
       default:0
    },
    total:Number,
    size:{
       type:Number,
       default:20
    },
    operatetion:{
      type: Boolean,
      default: false,
    },
  },
  methods:{
    handleCurrentChange(page){
      this.$emit('handleChangePage',page)
    },
    handleSelectionChange(val){
      this.$emit("handleSelectionChange", Array.from(val));
    }
  }
};
</script>

<style lang="scss" >
.table{

}
</style>