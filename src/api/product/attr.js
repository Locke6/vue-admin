import request from '@/utils/request'

const api_name = '/admin/product'

export default {

  /*
  查找一级分类列表
  */
  getCategorys1 () {
    return request({
      url: `${api_name}/getCategory1`,
      method: 'get'
    })
  },

  /*
  查找二级分类列表
  */
  getCategorys2 (category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: 'get'
    })
  },

  /*
  查找三级分类列表
  */
  getCategorys3 (category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: 'get'
    })
  },

  //获取对应属性列表
  getAttrlist ({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'get'
    })
  },

  // 删除属性
  delAttr (attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: 'delete'
    })
  },

  // 保存属性
  saveAttrInfo (attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'post',
      data: attr
    })
  }
}
