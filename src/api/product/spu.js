import request from '@/utils/request'

const api_name = '/admin/product'

export default {

  //获取对应属性列表
  getSpuList ({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: {
        category3Id
      }
    })
  },

  // 删除SPU
  delSpu (spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: 'delete'
    })
  },

  // 添加SPU
  saveSpuInfo (spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: 'post',
      data: spu
    })
  },

  // 修改SPU
  updateSpuInfo (spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: 'post',
      data: spu
    })
  },

  // 获取所有销售属性列表
  getSaleAttrList () {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: 'get',
    })
  },

  // 获取SPU销售属性列表
  getSpuSaleAttrList (spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: 'get',
    })
  },

  // 获取品牌列表
  getTrademarkList () {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: 'get',
    })
  },

  // 获取SPU图片列表
  getSpuImageList (spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: 'get',
    })
  }
}
