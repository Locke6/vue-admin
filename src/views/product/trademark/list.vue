<template>
  <div>
    <el-button type="primary" class="el-icon-plus" @click="add">添加</el-button>

    <!-- <Test :a.sync="count" /> -->

    <!-- 表格 -->
    <el-table
      :data="trademarkList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="100px">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            class="el-icon-edit"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            class="el-icon-delete"
            @click="delTrademark(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- 自定义事件中$event参数=事件的值 -->
    <el-pagination
      class="pagination"
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
      :title="trademarkForm.id ? '修改品牌' : '添加品牌'"
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
        <el-form-item label="品牌logo" prop="logoUrl" label-width="100px">
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
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Test from './test'
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
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'change' },
        ],
      },
      loading: false,
      // count: 0,
    }
  },
  // components: {
  //   Test,
  // },
  methods: {
    // 获取品牌管理数据
    async getPageList(page, size) {
      this.loading = true
      const result = await this.$API.trademark.getPageList(page, size)
      // console.log(result)
      // console.log('current:',result.data.current, 'size:',result.data.size)
      this.trademarkList = result.data.records
      this.total = result.data.total
      this.currentPage = result.data.current
      this.size = result.data.size
      this.loading = false
    },

    // 关闭对话框处理函数
    handleClose() {
      this.visible = false
    },

    // 打开添加窗口
    add() {
      this.visible = true
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate()
      // this.trademarkForm = {}
      this.trademarkForm.tmName = ''
      this.trademarkForm.logoUrl = ''
      this.trademarkForm.id = ''
    },

    //上传成功函数
    handleAvatarSuccess(res) {
      console.log(res.data)
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
          const { id, tmName, logoUrl } = this.trademarkForm
          // 判断数据是否更新，不更新则无法提交
          const tm = this.trademarkList.find((trademark) => id === trademark.id)
          if (tm.tmName === tmName && tm.logoUrl === logoUrl) {
            this.$message.warning('请修改数据后再更新')
            return
          }
          const result = id
            ? await this.$API.trademark.updateTrademark(this.trademarkForm)
            : await this.$API.trademark.addTrademark(this.trademarkForm)
          if (result.code === 200) {
            const data = id ? '修改数据成功!' : '上传数据成功!'
            this.$message.success(data)
            this.visible = false
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
    delTrademark(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await this.$API.trademark.delTrademark(id)
          this.getPageList(this.currentPage, this.size)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    // 更新品牌数据
    updateTrademark(row) {
      this.visible = true
      // this.trademarkForm = row
      this.trademarkForm = { ...row }
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate()
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

.el-table
  margin: 20px 0


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
