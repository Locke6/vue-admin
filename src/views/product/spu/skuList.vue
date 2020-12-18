<template>
  <el-card class="box-card">
    <el-form :model="skuList" label-width="100px" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">
        <span>{{ spuList.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="skuList.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU价格"
          style="width: 100%"
          v-model="skuList.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU重量"
          style="width: 100%"
          v-model="skuList.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="skuList.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          style="margin-bottom: 5px"
        >
          <el-form-item :label="attr.attrName">
            <!-- <label class="el-form-inline">{{ attr.attrName }}</label> -->
            <el-select
              placeholder="请选择品牌"
              v-model="attr.attrId"
              @change="addAttr(index, $event)"
            >
              <el-option
                :label="attrValue.valueName"
                :value="attrValue.id"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <div
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
          style="margin-bottom: 5px"
        >
          <el-form-item :label="saleAttr.saleAttrName">
            <el-select
              placeholder="请选择品牌"
              @change="addSale(index, $event, 'spuSaleAttrList')"
              v-model="saleAttr.SaleId"
            >
              <el-option
                :label="value.saleAttrValueName"
                :value="value.id"
                v-for="value in saleAttr.spuSaleAttrValueList"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-form-item>
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
              <template v-slot="{ row }">
                <el-tag type="success" v-if="row.isDefault">默认 </el-tag>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="setDefault(row)"
                  >设为默认</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-button
          type="primary"
          :disabled="false"
          style="margin-top: 20px"
          @click="save"
          >保存</el-button
        >
        <el-button
          style="margin: 20px 0 0 10px"
          @click="$emit('showDisplayList')"
          >取消</el-button
        >
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
        skuImageList: [],
      },
      rules: {
        skuName: [
          { required: true, message: '请输入sku名称', trigger: 'change' },
        ],
        price: [
          { required: true, message: '请输入sku价格', trigger: 'change' },
        ],
        weight: [
          { required: true, message: '请输入sku重量', trigger: 'change' },
        ],
        skuDesc: [
          { required: true, message: '请输入sku规格描述', trigger: 'change' },
        ],
        skuAttrValueList: [
          {
            required: true,
            validator: this.validateAttrValue,
          },
        ],
        spuSaleAttrList: [
          {
            required: true,
            validator: this.validateSaleAttr,
          },
        ],
        skuImageList: [
          {
            required: true,
            validator: this.validateImageList,
          },
        ],
      },
    }
  },
  props: {
    tempSku: Object,
  },
  methods: {
    // 清除校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop)
    },

    // 验证skuImageList
    validateImageList(rules, value, callback) {
      const {
        skuList: { skuImageList },
      } = this
      // console.log(skuImageList)
      if (!skuImageList.length) {
        callback(new Error('至少要有一张图片'))
        return
      }
      if (!skuImageList.some((image) => !!image.isDefault)) {
        callback(new Error('请选择默认图片'))
        return
      }
      callback()
    },
    // 验证saleAttrList
    validateSaleAttr(rules, value, callback) {
      const {
        skuList: { skuSaleAttrValueList },
        spuSaleAttrList,
      } = this
      if (spuSaleAttrList.length !== skuSaleAttrValueList.length) {
        callback(new Error('所有销售属性都要选择'))
        return
      }
      callback()
    },

    // 验证AttrValueList
    validateAttrValue(rules, value, callback) {
      const {
        skuList: { skuAttrValueList },
        attrList,
      } = this
      if (skuAttrValueList.length !== attrList.length) {
        callback(new Error('所有平台属性都要选择'))
        return
      }
      callback()
    },

    // 保存发送请求
    save() {
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          this.$message.success('校验通过')
        }
      })
    },

    // 设置默认图片
    setDefault(row) {
      this.clearValidate('skuImageList')
      this.spuImageList.forEach((image) => {
        this.$set(image, 'isDefault', '')
      })
      row.isDefault = 'default'

      /* this.spuImageList = this.spuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ?'isDefault' : '',
        };
      }); */

      this.skuList.skuDefaultImg = row.imgUrl
    },

    // 添加sale属性到skuList中
    addSale(index, id) {
      this.clearValidate('spuSaleAttrList')
      const sale = this.spuSaleAttrList[index].spuSaleAttrValueList.find(
        (sale) => sale.id === id
      )
      this.skuList.skuSaleAttrValueList.push(sale)
    },

    // 添加attr属性到skuList中
    addAttr(index, id) {
      this.clearValidate('skuAttrValueList')
      const attr = this.attrList[index].attrValueList.find(
        (attr) => attr.id === id
      )
      this.skuList.skuAttrValueList.push(attr)
    },

    // table勾选函数
    handleSelectionChange(skuImageList) {
      this.clearValidate('skuImageList')
      this.skuList.skuImageList = skuImageList
    },

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
        // this.spuImageList = result.data
        this.spuImageList = result.data.map((image) => {
          return {
            id: image.id,
            imgName: image.imgName,
            imgUrl: image.imgUrl,
            skuId: image.spuId,
          }
        })
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
</style>
