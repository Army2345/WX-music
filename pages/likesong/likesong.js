// pages/likesong/likesong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songId:"",
    likesong:{}
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function() {
    const eventChannel = this.getOpenerEventChannel()
     //监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
     eventChannel.on('acceptDataFromOpenerPage', data=> {
      // console.log(data);
      this.setData({
        songId:data
      })
    })
    this.getlikesong()
  },
getlikesong:function() {
  const sId=this.data.songId.data
  // console.log(sId);
 wx.request({
   url: 'http://localhost:3000/playlist/track/all?'+'id='+sId+'&limit='+10+'&offset='+1,
   success:(res)=>{
     console.log(res);
     this.setData({
       likesong:res.data.songs
     })

   }
 })
  
},

 //跳转到音乐播放页
 playlink: function (e) {
  console.log(e.currentTarget.dataset.index);
  //拿到当前数据下标
  const index = e.currentTarget.dataset.index
  //获取对应歌的数据
  const song = this.data.likesong
  console.log(song[index]);
  //获取歌曲id
  let mid = song[index].id
  console.log(mid);
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