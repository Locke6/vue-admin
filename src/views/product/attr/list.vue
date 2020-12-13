<template>
  <div>
    <Category @change="getAttrList" />

    <el-card class="box-card" style="margin-top: 20px">
      <el-button type="primary" class="el-icon-plus" style="margin-bottom: 20px"
        >添加属性</el-button
      >
      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150px">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              style="margin-right: 5px"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              class="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from './category'
export default {
  name: 'AttrList',
  data() {
    return {
      attrList: [],
    }
  },
  components: {
    Category,
  },
  methods: {
    getAttrList(attrList) {
      this.attrList = attrList
    },
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
