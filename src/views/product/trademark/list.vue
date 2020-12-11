<template>
  <div>
    <el-button type="primary" class="el-icon-plus" @click="visible = true"
      >添加</el-button
    >

    <!-- 表格 -->
    <el-table :data="trademarkList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100px">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            class="el-icon-edit"
            @click="
              updateTrademark(scope.row.tmName, scope.row.logoUrl, scope.row.id)
            "
            >修改</el-button
          >
          <el-button
            type="danger"
            class="el-icon-delete"
            @click="delTrademark(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- 自定义事件中$event参数=事件的值 -->
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="size"
      :current-page="currentPage"
      @size-change="getPageList(currentPage, $event)"
      @current-change="getPageList($event, size)"
    >
    </el-pagination>

    <!-- 新增对话框 -->
    <el-dialog
      :title="trademarkForm.id?'修改品牌':'添加品牌'"
      :visible.sync="visible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form :model="trademarkForm" :rules="rules" ref="trademarkForm">
        <el-form-item label="品牌名称" prop="tmName" label-width="100px">
          <el-input
            v-model="trademarkForm.tmName"
            autocomplete="off"
            :style="{ width: '70%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl" label-width="100px">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      trademarkList: [],
      total: 0,
      currentPage: 1,
      size: 3,
      visible: false,
      trademarkForm: {
        tmName: '',
        logoUrl: '',
        id: '',
      },
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    // 获取品牌管理数据
    async getPageList(page, size) {
      const result = await this.$API.trademark.getPageList(page, size)
      console.log(result)
      // console.log('current:',result.data.current, 'size:',result.data.size)
      this.trademarkList = result.data.records
      this.total = result.data.total
      this.currentPage = result.data.current
      this.size = result.data.size
    },

    // 关闭对话框处理函数
    handleClose() {
      this.visible = false
    },

    //上传成功函数
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data
    },

    // logo上传前处理函数
    beforeAvatarUpload(file) {
      const imagesTypes = ['image/jpeg', 'image/jpg', 'image/png']
      const isAllowedType = imagesTypes.indexOf(file.type) > -1
      const isLt50K = file.size / 1024 < 50
      if (!isAllowedType) {
        this.$message.error('上传头像图片只能是 jpg/png 格式!')
      }
      if (!isLt50K) {
        this.$message.error('上传头像图片大小不能超过 50KB!')
      }
      return isAllowedType && isLt50K
    },

    //发送请求添加品牌数据
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { id } = this.trademarkForm
          const result = id
            ? await this.$API.trademark.updateTrademark(this.trademarkForm)
            : await this.$API.trademark.addTrademark(this.trademarkForm)
          if (result.code === 200) {
            const data = id ? '修改数据成功!' : '上传数据成功!'
            this.$message.success(data)
            this.visible = false
            this.trademarkForm.id = ''
            this.getPageList(this.currentPage, this.size)
          } else {
            this.$message.error(result.message)
          }
        } else {
          console.log('校验不通过')
        }
      })
    },

    // 删除品牌数据
    async delTrademark(id) {
      await this.$API.trademark.delTrademark(id)
      this.getPageList(this.currentPage, this.size)
    },

    // 更新品牌数据
    updateTrademark(tmName, logoUrl, id) {
      this.visible = true
      this.trademarkForm.tmName = tmName
      this.trademarkForm.logoUrl = logoUrl
      this.trademarkForm.id = id
      // this.$API.trademark.delTrademark(id)
    },
  },
  mounted() {
    this.getPageList(this.currentPage, this.size)
  },
}
</script>
<style lang="sass" scoped>
.trademark-img
  width: 150px
  height: 75px

.el-table
  margin: 20px 0

.el-pagination
  text-align: right

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
</style>
