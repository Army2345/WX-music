// pages/singerDetail/singerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前歌手数据
    singerdata: {},
    //歌手详情页数据
    singerDetails: {},
    //歌手热门单曲
    hotsingersong:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取页面传递过来的歌手数据并进行存储
    const eventChannel = this.getOpenerEventChannel()
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', data => {
      // console.log(data)
      //数据存储
      this.setData({
        singerdata: data
      })
    })
    //调用函数
    this.getsingerDetail(),
    this.gethotsong()
  },
  //获取歌手页面详情数据
  getsingerDetail: function () {
    //获取id
    const id = this.data.singerdata.data.id
    // console.log(id);
    //通过id做数据请求
    wx.request({
      method:'POST',
      url: 'http://localhost:3000/artist/desc?id='+id,
      dataType:'json',
      success: (result) => {
        // console.log(result);
        //数据存储
        this.setData({
          singerDetails: result
        })
      }
    })
  },
  //获取歌手热门单曲
  gethotsong:function () {
    //获取id
    const id = this.data.singerdata.data.id
    //通过id做数据请求
    wx.request({
      url: 'http://localhost:3000/artists?id='+id,
      success:(result)=> {
        // console.log(result.data.hotSongs)
        //数据存储:并且只要前10首歌
        this.setData({
          hotsingersong:result.data.hotSongs.slice(0,10)
        })
      }
    })
    
  },
  //跳转到音乐播放页
  playlink: function (e) {
    // console.log(e.currentTarget.dataset.index);
    //拿到当前数据下标
    const index = e.currentTarget.dataset.index
    //获取对应歌的数据
    const song = this.data.hotsingersong
    // console.log(song[index]);

    //获取歌曲id
    let mid = song[index].id
    // console.log(mid);
    //先设置权限：有的歌没有版权不能听，则显示提示框，否则跳转到歌曲详情页
    //在音乐是否可用里面可以找到API
    wx.request({
      url: 'http://localhost:3000/check/music?id=' + mid,
      success: (result) => {
        // console.log(result.data);
        if (result.data.message === "ok") {
          console.log("可以播放");
          //数据存储：定义数据对象来存储数据下标和对应歌的数据
          const objdata = {}
          objdata.musiclist = song
          objdata.musicindex = index
          // console.log(objdata);
          //跳转页面
          wx.navigateTo({
            url: '/pages/play/play',
            success: (res) => {
              // 通过 eventChannel 向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: objdata })
            },
          })
        } else {
          console.log("不能播放");
          //显示提示框
          wx.showModal({
            content: '歌曲没有版权，请选择其他首歌进行播放',
            showCancel: true,
            title: '提示',
          })
        }
      },
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