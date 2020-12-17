import * as API from '@/api'
import { Message } from 'element-ui'

export default {
  // 命名空间,防止冲突
  // namespaced: true,
  state: {
    category: {
      category1Id: '',
      category2Id: '',
      category3Id: '',
    },
    attrVal1List: [],
    attrVal2List: [],
    attrVal3List: [],
  },
  actions: {
    // 获取一级分类列表
    async getAttrVal1List ({ commit }) {
      const result = await API.attr.getCategorys1()
      if (result.code === 200) {
        // Message.success('获取一级')
        commit('GET_ATTRVAL1LIST', result.data)
      } else {
        Message.error(result.Message)
      }
    },

    // 获取二级分类列表
    async getAttrVal2List ({ commit }, category1Id) {
      const result = await API.attr.getCategorys2(category1Id)
      if (result.code === 200) {
        commit('GET_ATTRVAL2LIST_SUCCESS', { attrVal2List: result.data, category1Id })
      } else {
        Message.error(result.Message)
        commit('GET_ATTRVAL2LIST_ERROR', category1Id)
      }
    },

    // 获取三级分类列表
    async getAttrVal3List ({ commit }, category2Id) {
      const result = await API.attr.getCategorys3(category2Id)
      if (result.code === 200) {
        commit('GET_ATTRVAL3LIST_SUCCESS', { attrVal3List: result.data, category2Id })
      } else {
        Message.error(result.Message)
        commit('GET_ATTRVAL3LIST_ERROR', category2Id)
      }
    },


  },

  mutations: {
    GET_ATTRVAL1LIST (state, attrVal1List) {
      state.attrVal1List = attrVal1List
    },

    GET_ATTRVAL2LIST_SUCCESS (state, { attrVal2List, category1Id }) {
      state.attrVal2List = attrVal2List
      state.attrVal3List = []
      state.category.category1Id = category1Id
      state.category.category2Id = ''
      state.category.category3Id = ''
    },

    GET_ATTRVAL2LIST_ERROR (state, category1Id) {
      state.attrVal2List = []
      state.attrVal3List = []
      state.category.category1Id = category1Id
      state.category.category2Id = ''
      state.category.category3Id = ''
    },

    GET_ATTRVAL3LIST_SUCCESS (state, { attrVal3List, category2Id }) {
      state.attrVal3List = attrVal3List
      state.category.category2Id = category2Id
      state.category.category3Id = ''
    },

    GET_ATTRVAL3LIST_ERROR (state, category2Id) {
      state.attrVal3List = []
      state.category.category2Id = category2Id
      state.category.category3Id = ''
    },

    // 获取三级属性ID
    GET_CATEGORY3ID (state, category3Id) {
      state.category.category3Id = category3Id
    },

    // 清空属性ID
    CLEAR_CATEGORYID (state) {
      state.category.category1Id = ''
      state.category.category2Id = ''
      state.category.category3Id = ''
    }
  }
}
