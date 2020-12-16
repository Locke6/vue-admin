<template>
  <el-card class="box-card">
    <el-form :model="spuList" label-width="100px" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ spuList.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuList.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU价格"
          style="width: 100%"
          v-model="skuList.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU重量"
          style="width: 100%"
          v-model="skuList.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="skuList.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          style="margin-bottom: 5px"
        >
          <label class="el-form-inline">{{ attr.attrName }}</label>
          <el-select
            placeholder="请选择品牌"
            @change="addAttr(index, $event)"
            v-model="attr.attrId"
          >
            <el-option
              :label="attrValue.valueName"
              :value="attrValue.id"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
          style="margin-bottom: 5px"
        >
          <label class="el-form-inline">{{ saleAttr.saleAttrName }}</label>
          <el-select
            placeholder="请选择品牌"
            @change="addSale(index, $event)"
            v-model="saleAttr.SaleId"
          >
            <el-option
              :label="value.saleAttrValueName"
              :value="value.id"
              v-for="value in saleAttr.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img
                class="trademark-img"
                :src="row.imgUrl"
                alt=""
                style="width: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作" align="center">
            <el-button type="primary" size="mini">设为默认</el-button>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="false" style="margin-top: 20px"
          >保存</el-button
        >
        <el-button style="margin: 20px 0 0 10px">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'Skulist',
  data() {
    return {
      spuList: this.tempSku,
      spuSaleAttrList: [],
      spuImageList: [],
      attrList: [],
      skuList: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
      },
    }
  },
  props: {
    tempSku: Object,
  },
  methods: {
    // 添加sale属性到skuList中
    addSale(index, id) {
      // console.log(index, id)
      const sale = this.spuSaleAttrList[index].spuSaleAttrValueList.find(
        (sale) => sale.id === id
      )
      this.skuList.skuSaleAttrValueList.push(sale)
    },

    // 添加attr属性到skuList中
    addAttr(index, id) {
      // console.log(index, id)
      const attr = this.attrList[index].attrValueList.find(
        (attr) => attr.id === id
      )
      this.skuList.skuAttrValueList.push(attr)
    },

    // table勾选函数
    handleSelectionChange() {},

    // 获取Spu销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spuList
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      if (result.code === 200) {
        this.$message.success('获取销售属性成功')
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 获取所有SPU图片
    async getSpuImageList() {
      const { id } = this.spuList
      const result = await this.$API.spu.getSpuImageList(id)
      if (result.code === 200) {
        this.$message.success('获取图片成功')
        this.spuImageList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 获取平台属性列表
    async getAttrList() {
      const result = await this.$API.attr.getAttrlist({
        category1Id: this.spuList.category1Id,
        category2Id: this.spuList.category2Id,
        category3Id: this.spuList.category3Id,
      })
      if (result.code === 200) {
        this.$message.success('获取平台属性成功')
        this.attrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
  },
  mounted() {
    this.getSpuSaleAttrList()
    this.getSpuImageList()
    this.getAttrList()
  },
}
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.el-form-inline
  display: inline-block
  width: 100px
  text-align: right
  padding-right: 10px
</style>
