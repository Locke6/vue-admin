<template>
  <div>
    <Category :isEditShow="isEditShow" />

    <!-- 展示table -->
    <el-card class="box-card" v-show="isEditShow" style="margin-top: 20px">
      <el-button
        type="primary"
        class="el-icon-plus"
        style="margin-bottom: 20px"
        @click="add"
        :disabled="!category.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150px">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              style="margin-right: 5px"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{ row, $index }">
            <el-button
              type="primary"
              class="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <!-- 传下标，将属性从属性列表中删除 -->
            <el-popconfirm
              :title="`确定删除${row.attrName}属性吗？`"
              @onConfirm="delAttrValue(row, $index)"
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
    </el-card>

    <!-- 添加/修改table -->
    <el-card class="box-card" v-show="!isEditShow" style="margin-top: 20px">
      <el-form :model="attrForm" inline>
        <el-form-item label="属性名">
          <el-input
            v-model="attrForm.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        :disabled="attrForm.attrName ? false : true"
        class="el-icon-plus"
        style="margin-bottom: 20px"
        @click="addAttr"
        >添加属性值</el-button
      >
      <el-button style="margin-left: 10px" @click="isEditShow = false"
        >取消</el-button
      >
      <el-table :data="attrForm.attrValueList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column label="属性名称">
          <template v-slot="{ row }">
            <el-input
              v-model="row.valueName"
              v-if="row.edit"
              @blur="completeEdit(row)"
              @keyup.enter.native="completeEdit(row)"
              size="mini"
              ref="input"
            ></el-input>
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
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
      <el-button
        type="primary"
        :disabled="!!!attrForm.attrValueList.length"
        style="margin-top: 20px"
        @click="save"
        >保存</el-button
      >
      <el-button style="margin: 20px 0 0 10px" @click="isEditShow = true"
        >取消</el-button
      >
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
export default {
  name: 'AttrList',
  data() {
    return {
      attrList: [],
      isEditShow: true,
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrForm: {
        attrName: '',
        attrValueList: [],
      },
    }
  },
  components: {
    Category,
  },

  methods: {
    // 添加属性
    add() {
      this.isEditShow = false
      this.attrForm.attrName = ''
      this.attrForm.attrValueList = []
      this.attrForm.id = ''
    },

    // 编辑属性
    update(row) {
      this.isEditShow = false
      this.attrForm = JSON.parse(JSON.stringify(row))
    },

    // 删除编辑状态的属性
    delEditAttrValue(index) {
      this.attrForm.attrValueList.splice(index, 1)
    },

    // 获取分级后属性列表
    async getAttrList(category) {
      this.category = category
      if (!this.category.category3Id) return (this.attrList = [])
      const result = await this.$API.attr.getAttrlist(category)
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取属性成功')
        this.attrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },

    // 删除属性
    async delAttrValue(row, index) {
      const { attrId } = row.attrValueList[0]
      const result = await this.$API.attr.delAttr(attrId)
      if (result.code === 200) {
        this.$message.success('删除成功')
      } else {
        this.$message.error(result.message)
      }
      this.attrList.splice(index, 1)
    },

    // 添加属性值
    addAttr() {
      const attrObj = {}
      this.$set(attrObj, 'valueName', '')
      this.$set(attrObj, 'edit', true)
      this.attrForm.attrValueList.push(attrObj)
      this.attrForm.categoryId = this.category.category3Id
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    // 点击文字可转换成输入框进行修改
    edit(row) {
      if (row.edit) {
        row.edit = true
      } else {
        this.$set(row, 'edit', true)
      }
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    // 退出修改
    completeEdit(row) {
      if (!row.valueName) return
      row.edit = false
    },

    async save() {
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
      this.isEditShow = true
    },
  },
  mounted() {
    this.$bus.$on('change', this.getAttrList)
  },
  beforeDestroy() {
    this.$bus.$off('change', this.getAttrList)
  },
}
</script>
<style lang="sass" scoped>
.el-button
  margin-left: 0
</style>
