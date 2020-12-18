export { default as login } from './acl/login' // {default: {}}
export { default as user } from './acl/user'
export { default as role } from './acl/role'
export { default as permission } from './acl/permission'
export { default as category } from './category'
export { default as clientUser } from './clientUser'
export { default as order } from './order'
export { default as trademark } from './product/trademark'
export { default as attr } from './product/attr'
export { default as spu } from './product/spu'

//this.$API.attr.saveAttrInfo()
//this.$API.api.attr.saveAttrInfo()
/*
  api:{
    login:context(./acl/login.js).default
    permission:context(./acl/permission.js).default
    category:context(./category/index.js).default
  }
*/

// 动态加载API文件
const context = require.context(".", true, /\.js$/)
// console.log(context.keys())
const api = context.keys().reduce((api, apiPath) => {
  let apiName
  if (apiPath.startsWith('./index.js')) return api
  if (!apiPath.startsWith('./index.js') && apiPath.indexOf('index.js') !== -1) {
    apiName = apiPath.replace(/^\.\/(.*)\/(.*)\.\w+$/, "$1")
  } else {
    apiName = apiPath.replace(/^\.\/(.*)\/(.*)\.\w+$/, "$2")
  }
  api[apiName] = context(apiPath).default
  return api
}, {})
// console.log(api)
export default api
