<template>
  <div>
    <SkuList
      v-if="isSkuShow"
      :tempSku="tempSku"
      @showDisplayList="showDisplayList"
    />

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
import { mapState, mapMutations } from 'vuex'
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
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    ...mapMutations(['CLEAR_CATEGORYID']),

    // 显示SkuList组件
    showSkulist(row) {
      this.isSkuShow = true
      this.tempSku = {
        ...this.category,
        ...row,
      }
    },

    // 显示SpuUpdateList组件
    showUpdateList(row) {
      this.isEditShow = false
      this.tempSpu = {
        category3Id: this.category.category3Id,
        ...row,
      }
    },

    // 显示SpuShowList组件
    showDisplayList() {
      this.isEditShow = true
      this.isSkuShow = false
    },
  },
  beforeDestroy() {
    this.CLEAR_CATEGORYID()
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
