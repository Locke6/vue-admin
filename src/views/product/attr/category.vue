<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="category" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="活动区域"
            @change="handleChange(1, $event)"
            :disabled="isEditShow"
          >
            <el-option
              :label="attrVal1.name"
              :value="attrVal1.id"
              v-for="attrVal1 in attrVal1List"
              :key="attrVal1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="活动区域"
            @change="handleChange(2, $event)"
            :disabled="isEditShow"
          >
            <el-option
              :label="attrVal2.name"
              :value="attrVal2.id"
              v-for="attrVal2 in attrVal2List"
              :key="attrVal2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="活动区域"
            @change="getAttrTable"
            :disabled="isEditShow"
          >
            <el-option
              :label="attrVal3.name"
              :value="attrVal3.id"
              v-for="attrVal3 in attrVal3List"
              :key="attrVal3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrVal1List: [],
      attrVal2List: [],
      attrVal3List: [],
    }
  },
  props: ['isEditShow'],
  methods: {
    // 获取分类属性信息
    async handleChange(classId, categoryId) {
      // console.log(classId, categoryId)
      if (classId === 1) {
        this.attrVal2List = []
        this.attrVal3List = []
        this.category.category2Id = ''
        this.category.category3Id = ''
      }
      if (classId === 2) {
        this.attrVal3List = []
        this.category.category3Id = ''
      }
      this.$emit('change', this.category)
      const res = await this.$API.attr[
        `getCategorys${classId ? classId + 1 : 1}`
      ](categoryId)
      this[`attrVal${classId ? classId + 1 : 1}List`] = res.data
    },

    // 获取分类后属性信息
    async getAttrTable(category3Id) {
      this.category = {
        ...this.category,
        category3Id,
      }
      this.$emit('change', this.category)
    },
  },
  mounted() {
    this.handleChange()
  },
}
</script>

