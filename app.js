import request from './pages/api/request';

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
// app.js
App({
  globalData: {
    tokenKey: "access-token",
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: ''
    }
  },
  onLaunch: function () {
    wx.login({
      success: (res) => {
        if(res.code) {
          console.log('start to fetch token from remote server...')
          request.post('/api/login', res.code)
          .then(resp => {
            if(resp && resp.data && resp.data.data){
              wx.setStorageSync(this.globalData.tokenKey, resp.data.data.token)
              this.loadUserInfo()
            }
          })
        } else {
          console.warn('登录失败!' + res.errMsg);
        }
      },
    })
  },

  async loadUserInfo() {
    try {
      const token = wx.getStorageSync(this.globalData.tokenKey)
      if (!token) return

      const result = await request.get('/api/user/profile')
      this.globalData.userInfo = result.data
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }
})
