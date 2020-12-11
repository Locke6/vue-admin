<template>
  <div>
    <el-button type="primary" class="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="100px"> </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logo" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="opration" label="操作">
        <template>
          <el-button type="warning" class="el-icon-edit">修改</el-button>
          <el-button type="danger" class="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, jumper, sizes, total"
    :total="30"
    :page-sizes="[3,6,9]"
    :page-size="3"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '哈士奇',
          logo:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3599475514,2710235154&fm=26&gp=0.jpg',
        },
      ],
    }
  },
}
</script>
<style lang="sass">
.trademark-img
  width: 150px
.el-table
  margin: 20px 0
.el-pagination
  text-align: right
</style>
