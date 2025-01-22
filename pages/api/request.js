const tokenKey = "access-token";
const AuthorizationPrefix = "Bearer "
const ServerUrl = "http://localhost:8085";
//不需要token的url
const whiteList = ["/api/login"]

function createHeader(url) {
  let header = {}
  header['content-type'] = 'application/json'
  if (whiteList.indexOf(url) == -1) {
    let token = wx.getStorageSync(tokenKey);
    header['Authorization'] = AuthorizationPrefix + token
  }
  return header;
}

function post(url, data) {
  let header = createHeader(url)
  return new Promise((resolve, reject) => {
    wx.request({
      url: ServerUrl + url,
      data: data,
      header: header,
      method: 'POST',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}


function get(url) {
  let header = createHeader(url)
  return new Promise((resolve, reject) => {
    wx.request({
      url: ServerUrl + url,
      header: header,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}

function uploadFile(options) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync(tokenKey)
    
    wx.uploadFile({
      url: `${ServerUrl}${options.url}`,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 注意：uploadFile 的响应数据是字符串
          const data = JSON.parse(res.data)
          resolve(data)
        } else if (res.statusCode === 401) {
          // wx.redirectTo({ url: '/pages/login/login' })
          reject(new Error('未登录或登录已过期'))
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: reject
    })
  })
}

module.exports.post = post;
module.exports.get = get;
module.exports.uploadFile = uploadFile;