<template>
  <div>
    <el-card class="box-card">
      <el-form
        :inline="true"
        :model="category"
        :disabled="!isEditShow"
        class="demo-form-inline"
      >
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="活动区域"
            @change="handleGetAttrVal2List($event)"
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
            @change="handleGetAttrVal3List($event)"
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
            @change="GET_CATEGORY3ID($event)"
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
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Category',
  data() {
    const { category } = this.$store.state.category
    return {
      category: {
        category1Id: category.category1Id,
        category2Id: category.category2Id,
        category3Id: category.category3Id,
      },
    }
  },
  props: ['isEditShow'],
  computed: {
    ...mapState({
      attrVal1List: (state) => state.category.attrVal1List,
      attrVal2List: (state) => state.category.attrVal2List,
      attrVal3List: (state) => state.category.attrVal3List,
    }),
  },
  methods: {
    ...mapActions(['getAttrVal1List', 'getAttrVal2List', 'getAttrVal3List']),
    ...mapMutations(['GET_CATEGORY3ID']),
    handleGetAttrVal2List(category1Id) {
      this.category.category2Id = ''
      this.category.category3Id = ''
      this.getAttrVal2List(category1Id)
    },
    handleGetAttrVal3List(category2Id) {
      this.category.category3Id = ''
      this.getAttrVal3List(category2Id)
    },
  },
  mounted() {
    this.getAttrVal1List()
  },
}
</script>

