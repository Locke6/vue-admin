<template>
  <div>
    <el-button type="primary" class="el-icon-plus">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100px">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="opration" label="操作">
        <template>
          <el-button type="warning" class="el-icon-edit">修改</el-button>
          <el-button type="danger" class="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="size"
      :current-page="currentPage"
      @size-change="getPageList(currentPage, $event)"
      @current-change="getPageList($event, size)"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      trademarkList: [],
      total: 0,
      currentPage: 1,
      size: 3,
    }
  },
  methods: {
    async getPageList(page, size) {
      const result = await this.$API.trademark.getPageList(page, size)
      // console.log(result)
      this.trademarkList = result.data.records
      this.total = result.data.total
      this.currentPage = result.data.current
      this.size = result.data.size
    },
  },
  mounted() {
    this.getPageList(this.currentPage, this.size)
  },
}
</script>
<style lang="sass" scoped>
.trademark-img
  width: 150px
  height: 75px
.el-table
  margin: 20px 0
.el-pagination
  text-align: right
>>>.el-pagination__jump
  margin-left: 500px
</style>
