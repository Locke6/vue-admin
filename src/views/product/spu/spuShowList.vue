<template>
  <el-card class="box-card" style="margin-top: 20px">
    <el-button
      type="primary"
      class="el-icon-plus"
      style="margin-bottom: 20px"
      :disabled="!category.category3Id"
      @click="$emit('showUpdateList', { category3Id: category.category3Id })"
      >添加SPU</el-button
    >
    <el-table :data="spuList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button
            type="primary"
            class="el-icon-plus"
            size="mini"
            @click="$emit('showSkulist', { row, category })"
          ></el-button>
          <el-button
            type="primary"
            class="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" class="el-icon-info" size="mini"></el-button>
          <el-popconfirm
            :title="`确定删除${row.attrName}属性吗？`"
            @onConfirm="delAttrValue(row, $index)"
          >
            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      @size-change="getSpuList(page, $event)"
      @current-change="getSpuList($event, limit)"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'SpuShowList',
  data() {
    return {
      spuList: [],
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },

      page: 1,
      limit: 6,
      total: 0,
      loading: false,
    }
  },

  methods: {
    // 判断是否有category3Id
    async getAttrList(category) {
      this.category = category
      if (!this.category.category3Id) {
        this.page = 1
        this.total = 0
        this.limit = 6
        this.spuList = []
        return
      }
      const { page, limit } = this
      this.getSpuList(page, limit)
    },

    // 获取分级后SPU列表
    async getSpuList(page, limit) {
      this.loading = true
      const { category3Id } = this.category
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      })
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取属性成功')
        this.spuList = result.data.records
        this.page = result.data.current
        this.limit = result.data.size
        this.total = result.data.total
        this.loading = false
      } else {
        this.$message.error(result.message)
      }
    },
  },
  mounted() {
    this.$bus.$on('change', this.getAttrList)
  },
  beforeDestroy() {
    this.$bus.$off('change', this.getAttrList)
  },
}
</script>

<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
