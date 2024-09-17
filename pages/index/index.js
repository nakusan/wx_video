// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '刷新中...'
    });
    var that = this;
    wx.request({
      url: 'https://api.dongqiudi.com/old/columns/138?page=', //你的接口地址
      success(res) {
        var data = res.data;
        var articles = data.data;
        console.log(articles)
        var videos = [];
        for (var i = 0; i < articles.length; i++) {
          var video = {};
          video.title = articles[i].title;
          video.thumb = articles[i].litpic;
          video.url = "https://api.dongqiudi.com/v2/articles/video_info/" + articles[i].aid;
          videos.push(video);
        }
        console.log(videos)
        that.setData({ 
          rows: videos
        })
      },
      fail(err) {
        console.error('请求失败:', err)
        wx.hideLoading();
        wx.showToast({
          title: '刷新失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  onItemClick: function (event) {
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