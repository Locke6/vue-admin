<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="category" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="category.category1Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="category.category2Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category.category3Id" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <el-button type="primary" class="el-icon-plus" style="margin-bottom: 20px">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="tmName" label="属性名称" width="150px">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="scope">
            <img class="trademark-img" :src="scope.row.logoUrl" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              class="el-icon-edit"
              @click="updateTrademark(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              class="el-icon-delete"
              @click="delTrademark(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',
  data() {
    return {
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrList: [],
    }
  },
}
</script>
