<template>
  <div>
    <Category :isEditShow="isEditShow" />

    <!-- 展示table -->
    <SpuShowList v-if="isEditShow" @showUpdateList="showUpdateList" />
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
      category3Id: '',
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },

  methods: {

    // 显示更新SPU组件
    showUpdateList(row) {
      this.isEditShow = false
      // console.log(row)
      this.tranferSpu = {
        ...row,
      }
    },

    // 显示展示SPU组件
    showDisplayList(category3Id) {
      this.isEditShow = true
      this.category3Id = category3Id
      this.$nextTick(() => {
        this.$bus.$emit('change', category3Id)
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
