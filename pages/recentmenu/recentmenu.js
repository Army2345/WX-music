// pages/recentmenu/recentmenu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvid: "",
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      // console.log(data)
      var mvid = data.data
      // console.log(mvid);
      this.setData({
        mvid: mvid
      })
    })
    this.getmv()
  },
  getmv: function () {
    var mvid = this.data.mvid
    wx.request({
      url: 'http://localhost:3000/mv/url?id=' + mvid,
      success: (res) => {
        // console.log(res);
        var url = res.data.data.url
        // console.log(url);
        this.setData({
          url: url
        })
      }
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