<template>
  <div>
    <SkuList v-if="isSkuShow" :tempSku="tempSku" />

    <div v-else>
      <Category :isEditShow="isEditShow" />

      <!-- 展示table -->
      <SpuShowList
        v-if="isEditShow"
        @showUpdateList="showUpdateList"
        @showSkulist="showSkulist"
      />
      <!-- 添加/修改table -->
      <SpuUpdateList
        v-else
        @showDisplayList="showDisplayList"
        :tempSpu="tempSpu"
      />
    </div>
  </div>
</template>

<script>
import Category from '@/components/Category'
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
import SkuList from './skuList'
export default {
  name: 'SpuList',
  data() {
    return {
      isEditShow: true,
      attrForm: {
        attrName: '',
        attrValueList: [],
      },
      tempSpu: {},
      category3Id: '',
      isSkuShow: false,
      tempSku: {},
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },

  methods: {
    // 显示SkuList组件
    showSkulist({ row, category }) {
      this.isSkuShow = true
      this.tempSku = {
        ...row,
        ...category,
      }
      console.log(this.tempSku)
    },

    // 显示SpuUpdateList组件
    showUpdateList(row) {
      this.isEditShow = false
      // console.log(row)
      this.tempSpu = {
        ...row,
      }
    },

    // 显示SpuShowList组件
    showDisplayList(category3Id) {
      this.isEditShow = true
      this.category3Id = category3Id
      this.$nextTick(() => {
        this.$bus.$emit('change', { category3Id })
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
