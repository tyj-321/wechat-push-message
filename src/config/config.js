/* params是需要自定义的配置项 */
const params = {
  appid: 'wx3126faf342dfbcf1',
  secret: '56e00957b75a0a3fe1e992b32b2b5b5e',
  touser: 'o2Qlr5lPJZANMnrUYzXt4auEEPIo',
  template_id: 'KQTatbj3uI8EZ3sQnIOIIN1q__L0Due51uWw5wW3UV4',
}

function verifyEmpty() {
  var flag = ''
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      if (!params[key]) {
        flag = key
        break
      }
    }
  }
  return flag
}

// 校验为空
if (verifyEmpty()) {
  console.error(
    '警告：请完善 “/src/config/config.js中的配置项: ' +
    verifyEmpty() +
    '”的内容,再执行代码！'
  )
  process.exit(0)
}

module.exports = {
  params,
  // listConfig,
}
