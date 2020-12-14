<template>
  <div>
    <Category :isEditShow="isEditShow" />

    <!-- 展示table -->
    <SpuShowList
      v-if="isEditShow"
      @showUpdateList="showUpdateList"
      :categorySave="categorySave"
    />
    <!-- 添加/修改table -->
    <SpuUpdateList
      v-else
      @showDisplayList="showDisplayList"
      :tranferSpu="tranferSpu"
    />
  </div>
</template>

<script>
import Category from '@/components/Category'
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
export default {
  name: 'SpuList',
  data() {
    return {
      isEditShow: true,
      attrForm: {
        attrName: '',
        attrValueList: [],
      },
      tranferSpu: {},
      categorySave: {},
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },

  methods: {
    // 显示更新SPU组件
    showUpdateList(row, category) {
      this.isEditShow = false
      this.tranferSpu = { ...row }
      this.categorySave = category
    },

    // 显示展示SPU组件
    showDisplayList() {
      this.isEditShow = true
    },
    /* async save() {
      if (!this.attrForm.id) {
        this.attrForm.categoryId = this.category.category3Id
        this.attrForm.categoryLevel = 3
      }
      const result = await this.$API.attr.saveAttrInfo(this.attrForm)
      // console.log(result)
      if (result.code === 200) {
        this.$message.success('更新属性成功')
        this.getAttrList(this.category)
      } else {
        this.$message.error(result.message)
      }
      this.isEditShow = false
    }, */
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
