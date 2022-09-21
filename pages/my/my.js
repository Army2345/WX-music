// pages/my/my.js
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
    //本地存储
    userInfo: {},
    recentlist: {},
    //搜索信息
    words: [],
    //输入文本
    text: "",
    //用户id
    userId: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //读取用户信息userInfo
    var userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo);
    if (userInfo) {
      // console.log(userInfo);
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
    this.getrecentmenu()
    this.getlikemenu()

  },

  user: () => {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //搜索框
  input: function (e) {
    // console.log(e);
    // console.log(e.detail.value);
    var text = e.detail.value
    // console.log(text);
    this.setData({
      text: text
    })
    if (!text) {
      this.setData({
        words: []
      })
    }
    wx.request({
      url: 'http://localhost:3000/cloudsearch?keywords=' + text,
      success: (res) => {
        // console.log(res);
        var words = res.data.result.songs
        // console.log(words);
        this.setData({
          words: words.splice(0, 7)
        })
      }
    })
  },

  //搜索出来的歌播放
  //跳转到音乐播放页
  playlink: function (e) {
    // console.log(e.currentTarget.dataset.index);
    var words = this.data.words
    //拿到当前数据下标
    const index = e.currentTarget.dataset.index
    //获取对应歌的数据
    const song = this.data.words
    // console.log(song)
    // console.log(song[index]);
    //获取歌曲id
    let mid = song[index].id
    // console.log(mid);
    var idList = []
    for (var i = 0; i < song.length; i++) {
      idList.push(song[i].id)
    }
    // console.log(idList);
    this.setData({
      idList: idList
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
            url: '/pages/play/play?' + 'id=' + mid + '&idlist=' + idList,
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
  //我的歌单
  getlikemenu: function () {
    // console.log(this.data);
    const userId = this.data.userInfo.userId
    // console.log(userId);
    wx.request({
      url: 'http://localhost:3000/user/playlist?' + 'offset=' + 0 + '&limit=' + 100 + '&uid=' + userId,
      success: (result) => {
        // console.log(result);
        // console.log(result.data.playlist[0].id);
        this.setData({
          likemenu: result.data.playlist.splice(0, 10)
        })
      },

    })

  },



  likesong: function (e) {
    // console.log(e.currentTarget.dataset.index);
    const index = e.currentTarget.dataset.index
    // console.log(index);
    const songid = this.data.likemenu[index].id
    // console.log(songid);
    wx.navigateTo({
      url: '/pages/likesong/likesong',
      success: (res) => {
        // console.log(result);
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: songid })
      },
    })
  },
  //最近播放
  getrecentmenu: function () {
    const userId = this.data.userInfo.userId
    // console.log(userId);
    wx.request({
      url: 'http://localhost:3000/user/record?' + 'uid=' + userId + '&type=' + 0,
      success: (result) => {
        // console.log(result);
        this.setData({
          recentlist: result.data.allData.splice(0, 10)
        })
      },
    })
  },
  recentcontent: function (e) {
    //获取当前视频下标
    const index = e.currentTarget.dataset.index
    // console.log(index);
    const mvUrl = this.data.recentlist
    // console.log(mvUrl[index]);
    const songid = mvUrl[index].song.al.id
    // console.log(songid);
    const mvid = mvUrl[index].song.mv
    // console.log(mvid);
    if (mvid == 0) {
      //显示提示框
      wx.showModal({
        content: '暂时没有相关视频，请选择其他视频进行播放',
        showCancel: true,
        title: '提示',
      })
      }
     else {
      wx.navigateTo({
        url: '/pages/recentmenu/recentmenu',
        success: (res) => {
          // console.log(res);
          // 通过 eventChannel 向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: mvid })
        },

      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


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