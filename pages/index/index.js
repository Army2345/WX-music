// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    background: {},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    //singer数据
    singers: {},
    //最新音乐数据
    newmusic: [],
    action:{
      "method":"play"
    },
    //歌曲id列表
    idList:[]

  },
  // 获取轮播图数据接口,请求banner中的数据
  getbanner: function () {
    wx.request({
      method: 'GET',
      url: 'http://localhost:3000/banner',
      dataType: 'json',
      success: (result) => {
        console.log(result.data.banners);
        //数据存储：设置给background
        this.setData({
          background: result.data.banners
        })
      }
    })
  },
  //获取热门歌手数据请求
  getsinger: function () {
    wx.request({
      method: 'GET',
      url: 'http://localhost:3000/top/artists',
      dataType: 'json',
      success: (result) => {
        // console.log(result.data.artists);
        //数据存储：设置给singers 并且只要前10个歌手
        this.setData({
          singers: result.data.artists.slice(0, 10)
        })
      }
    })
  },
  //跳转到歌手详情页
  hotlink: function (e) {
    // console.log(e.currentTarget.dataset.index);
    //拿到当前数据下标
    const index = e.currentTarget.dataset.index
    //获取对应歌手数据
    const singer = this.data.singers
    // console.log(singer[index]);  
    //跳转页面和数据传递
    wx.navigateTo({
      url: '/pages/singerDetail/singerDetail',
      success: (res) => {
        // console.log(res);
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: singer[index] })
      },
    })
  },


  //获取最新音乐数据请求
  getnewmusic: function () {
    wx.request({
      method: 'GET',
      url: 'http://localhost:3000/personalized/newsong',
      dataType: 'json',
      success: (result) => {
        // console.log(result.data.result);
        //数据存储：设置给newmusic
        this.setData({
          newmusic: result.data.result
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
    const song = this.data.newmusic
    // console.log(song)
    // console.log(song[index]);
    //获取歌曲id
    let mid = song[index].id
    // console.log(mid);
    var idList=[]
    for(var i=0;i<song.length;i++){
      idList.push(song[i].id)
    }
    // console.log(idList);
    this.setData({
      idList:idList
    })
    // console.log(this.data.idList);
    //先设置权限：有的歌没有版权不能听，则显示提示框，否则跳转到歌曲详情页
    //在音乐是否可用里面可以找到API
    wx.request({
      url: 'http://localhost:3000/check/music?id=' + mid,
      success: (result) => {
        // console.log(result.data);
        if (result.data.message === "ok") {
          // console.log("可以播放");
          //数据存储：定义数据对象来存储数据下标和对应歌的数据
          const objdata = {}
          objdata.musiclist = song
          objdata.musicindex = index
          // console.log(objdata);
          //跳转页面
          wx.navigateTo({
            url: '/pages/play/play?'+'id='+mid+'&idlist='+idList,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //调用banner
    this.getbanner()
    //调用热门歌手
    this.getsinger()
    //调用最新音乐
    this.getnewmusic()
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