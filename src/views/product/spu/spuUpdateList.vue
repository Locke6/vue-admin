<template>
  <el-card class="box-card" style="margin-top: 20px">
    <el-form :model="spuList" label-width="100px" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spuList.tmId">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spuList.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
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
      <el-form-item label="销售属性" prop="filterSaleAttr">
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
                @onConfirm="delSpuSaleAttr($index)"
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
        <el-button
          type="primary"
          :disabled="false"
          style="margin-top: 20px"
          @click="save('spuForm')"
          >保存</el-button
        >
        <el-button
          style="margin: 20px 0 0 10px"
          @click="$emit('showDisplayList', spuList.category3Id)"
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
      visible: false,
      spuImageList: [],
      previewImageUrl: '',
      spuSaleAttrList: [],
      saleAttrList: [],
      inputValue: '',
      rules: {
        spuName: [{ required: true, message: '请输入SPU名称' }],
        tmId: [{ required: true, message: '请选择SPU品牌' }],
        description: [{ required: true, message: '请输入SPU描述' }],
        spuImageList: [{ required: true, validator: this.imageListValidator }],
        filterSaleAttr: [{ required: true, validator: this.saleAttrValidator }],
      },
      loading: false,
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
    // 删除Spu属性
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1)
    },

    // 图片列表校验
    imageListValidator(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        // 校验通过
        callback()
        return
      }
      callback(new Error('至少上传一张SPU图片'))
    },

    // 销售属性校验
    saleAttrValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        // 校验失败
        callback(new Error('至少有一种销售属性'))
        return
      }
      const failSaleAttr = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      )
      if (failSaleAttr) {
        // 校验失败
        callback(new Error('每种销售属性中至少有一项属性'))
        return
      }
      callback()
    },

    // 保存
    save(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const spuList = {
            ...this.spuList,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          }
          const { id } = spuList
          const result = id
            ? await this.$API.spu.updateSpuInfo(spuList)
            : await this.$API.spu.saveSpuInfo(spuList)
          // console.log(result)
          if (result.code === 200) {
            this.$message.success(id ? '更新属性成功' : '添加属性成功')
            this.$emit('showDisplayList', spuList.category3Id)
          } else {
            this.$message.error(result.message)
          }
          this.isEditShow = false
        }
      })
    },

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
    tempSpu: Object,
  },
  async mounted() {
    await this.getTrademarkList()
    this.spuList = this.tempSpu
    this.getSaleAttrList()
    const { id } = this.spuList
    if (id) {
      this.getSpuImageList()
      this.getSpuSaleAttrList()
    }
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
