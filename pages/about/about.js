import request from '../api/request';

const app = getApp()

// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    hasUserInfo: false,
    historyItems: [
      {
        "thumbUrl": "../../images/swiper1.jpg", 
        "videoTitle": "测试，哈哈",
        "url": "https://api.dongqiudi.com/v2/articles/video_info/484567"
      },
      {
        "thumbUrl": "../../images/swiper2.jpg", 
        "videoTitle": "good",
        "url": "https://api.dongqiudi.com/v2/articles/video_info/481522"
      }
    ]
  },

  onLoad() {
    // 检查是否已有用户信息
    if (app.globalData.userInfo) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        hasUserInfo: app.globalData.userInfo.nickName == '' ?  false : true
      })
    }
    this.getUserVisitHistory();
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl
    })
  },

  onNicknameChange(e) {
    this.setData({
      nickName: e.detail.value
    })
  },

   // 保存用户信息
   async saveUserInfo() {
    try {
      // 上传头像到自己的服务器
      const uploadRes = await request.uploadFile({
        url: '/api/file/upload',
        filePath: this.data.avatarUrl,
        name: 'file'
      })
      // 保存用户信息
      await request.post('/api/user/profile',
      {
        avatarUrl: uploadRes.path,
        nickName: this.data.nickName
      })

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  async getUserVisitHistory() {
    try {
      const historyItems = await request.get('/api/video-info/getUserVisitInfo')
      this.setData({
        historyItems: historyItems
      })
    } catch (error) {
      console.error('获取访问历史记录失败')
      wx.showToast({
        title: '获取访问历史记录失败',
        icon: 'none'
      })
    }
  },

  onHistoryItemClick(event) {
    console.log('click history')
    console.log(event)
    var url = event.currentTarget.dataset.video.url;
    var title = event.currentTarget.dataset.video.title;
    wx.navigateTo({
      url: '../video/video?url=' + url + "&title=" + title
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})