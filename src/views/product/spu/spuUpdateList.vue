<template>
  <el-card class="box-card" style="margin-top: 20px">
    <el-form :model="spuList" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuList.tmId">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spuList.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="formatImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="visible">
          <img width="100%" :src="previewImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="
            filterSaleAttrList.length
              ? `还有${filterSaleAttrList.length}个未选择`
              : '没有啦宝贝~'
          "
          v-model="spuList.filterSaleAttr"
        >
          <el-option
            :label="filterSaleAttr.name"
            :value="`${filterSaleAttr.id}-${filterSaleAttr.name}`"
            v-for="filterSaleAttr in filterSaleAttrList"
            :key="filterSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          class="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!filterSaleAttrList.length"
          @click="addSpuSale"
          >添加销售属性</el-button
        >
        <el-table :data="spuSaleAttrList" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column label="属性名" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <el-tag
                type="success"
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                style="margin-right: 5px"
                closable
                @close="handleClose(row, index)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}</el-tag
              >
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="inputValue"
                ref="input"
                size="mini"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                icon="el-icon-plus"
                class="button-new-tag"
                size="mini"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <!-- 传下标，将属性从属性列表中删除 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}属性吗？`"
                @onConfirm="delEditAttrValue($index)"
              >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="false" style="margin-top: 20px"
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
  name: 'SpuUpdateList',
  data() {
    return {
      spuList: {},
      trademarkList: [],
      trademarkId: '',
      visible: false,
      spuImageList: [],
      previewImageUrl: '',
      spuSaleAttrList: [],
      saleAttrList: [],
      addSpuSaleAttr: {},
      inputValue: '',
    }
  },
  computed: {
    // 处理spu图片属性名，用于照片墙展示
    formatImageList() {
      return this.spuImageList.map((img) => {
        return {
          uid: img.uid || img.id,
          // id: img.id,
          name: img.imgName,
          url: img.imgUrl,
        }
      })
    },

    // 过滤出spuSaleAttr中不包含的属性，展示到下拉列表中
    filterSaleAttrList() {
      return this.saleAttrList.filter(
        (saleAttr) =>
          !this.spuSaleAttrList.find(
            (spuSaleAttr) => saleAttr.id === spuSaleAttr.baseSaleAttrId
          )
      )
    },
  },
  methods: {
    // 图片上传成功函数
    handleAvatarSuccess(res, file) {
      // console.log(res,file)
      const { id } = this.spuList
      this.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: id,
        uid: file.uid,
      })
    },

    // 添加spuSaleAttr
    addSpuSale() {
      const { filterSaleAttr, id } = this.spuList
      const [baseSaleAttrId, saleAttrName] = filterSaleAttr.split('-')
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      })
      this.spuList.filterSaleAttr = ''
    },

    // 显示输入框
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    // 添加saleAttrValue值
    handleInputConfirm(row) {
      const { id } = this.spuList
      if (this.inputValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrValueName: this.inputValue,
          saleAttrName: row.saleAttrName,
          spuId: id,
        })
      }
      row.inputVisible = false
      this.inputValue = ''
    },

    // 关闭标签
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },

    // 删除图片回调
    handleRemove(file, fileList) {
      // console.log(file, fileList)

      this.spuImageList = this.spuImageList.filter(
        (img) => img.imgUrl !== file.url
      )
      // console.log(this.spuImageList, file)
    },

    // 放大图片回调
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url
      this.visible = true
    },

    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList()
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取品牌数据成功')
        this.trademarkList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 获取所有SPU图片
    async getSpuImageList() {
      const { id } = this.spuList
      const result = await this.$API.spu.getSpuImageList(id)
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取图片成功')
        // this.spuImageList = result.data
        this.spuImageList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 获取Spu销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spuList
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取SPU销售属性成功')
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 获取所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList()
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取所有销售属性成功')
        this.saleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
  },
  props: {
    tranferSpu: Object,
  },
  mounted() {
    this.spuList = this.tranferSpu
    this.getTrademarkList()
    this.getSpuImageList()
    this.getSpuSaleAttrList()
    this.getSaleAttrList()
  },
}
</script>

<style lang="sass" scoped>
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block

.button-new-tag
  height: 32px
  line-height: 30px
  padding-top: 0
  padding-bottom: 0

.input-new-tag
  width: 90px
  margin-left: 10px
  vertical-align: bottom
</style>
