
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //歌曲下标
    musicIndex: "",
    //歌曲列表
    musicList: [],
    //获取当前歌曲id
    musicId: "",
    //当前播放的歌曲
    music: {},
    //控制播放音乐
    action: {
      "method": "play"
    },
    //歌词
    songwords: [],
    //当前播放歌词的下标,默认-1
    index: -1,
    //设置竖向滚动条位置
    top: 0,
    //当前播放时间
    currenttime: "00:00",
    //总实长
    timeall: "03:56",
    //进度条最大值
    max: 0,
    //进度条当前播放时间
    value: 0,
    change:0,
    mId:"",
    //循环模式
    mode:'loop',
    //歌曲id列表
    idList:[],
    //歌词
    lrcstr:{}
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    // console.log(e);
    var IdList=e.idlist
    // console.log(IdList);
    var idListStr=IdList.split(",")
    // console.log(idListStr);
    this.setData({
      idList:idListStr
    })
    // console.log(this.data.idList);
    const eventChannel = this.getOpenerEventChannel()
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', data => {
      // console.log(data.data)
      const musicList = data.data.musiclist
      // console.log(musicList);
      const musicIndex = data.data.musicindex
      //获取当前播放的歌曲数据
      const music = musicList[musicIndex]
      // console.log(music);
      // console.log(music.id);
      //获取歌手详情页中当前播放歌曲数据
      // const music=musicList
      //存储数据
      this.setData({
        musicList: musicList,
        musicIndex: musicIndex,
        musicId: music.id,
        music: music
      })
    })
    //调用函数
    this.getplaywords()
  },
  //控制音乐播放暂停
  playdate: function () {
    //获取当前的状态
    let date = this.data.action.method
    // console.log(date);
    if (date === "play") {
      //数据存储
      this.setData({
        action: {
          "method": "pause"
        }
      })
    } else {
      this.setData({
        action: {
          "method": "play"
        }
      })
    }
  },
  
  //获取歌词
  getplaywords: function () {
    //获取歌曲id
    const musicId = this.data.musicId
    wx.request({
      url: 'http://localhost:3000/lyric?id=' + musicId,
      success: (result) => {
        // console.log(result);
        const lrcstr = result.data.lrc.lyric
        // console.log(lrcstr);
        //整理歌词
        this.showlyric(lrcstr)
      },
    })
  },
  //整理歌词
  showlyric: function (lrc) {
    // 处理字符串  拿到时间和歌词
    //1.进行字符串拆分  拆成一句一句列表形式
    var lrclist = lrc.split("\n")
    // console.log(lrclist);
    //设置每行歌词时间数据列表为空
    var lrctimelist = []
    //2.设置正则   [00:44.552]   [02:12.16]
    var re = /\[\d{2}:\d{2}.\d{2,3}\]/
    for (var i = 0; i < lrclist.length; i++) {
      //3.拆分时间和歌词
      var date = lrclist[i].match(re)
      //  console.log(date);
      //判断时间数组不能为空
      if (date != null) {
        //拿到歌词  替换字符串  把时间替换为空字符剩下就是歌词
        var wds = lrclist[i].replace(re, "")
        //拿到时间字符串
        var timestr = date[0]
        // console.log(timestr);
        //判断时间字符串是否为空
        if (timestr != null) {
          //处理时间  要把分钟换成秒然后与：后面的秒数相加等于总的秒数
          var timestr_slice = timestr.slice(1, -1) //先把前后两个[]去掉
          // console.log(timestr_slice);
          //分钟和秒拆分
          var splitlist = timestr_slice.split(":")
          var m = splitlist[0]
          var s = splitlist[1]
          //计总秒数
          var ss = parseFloat(m) * 60 + parseFloat(s)
          // console.log(ss);
          //列表追加数据
          lrctimelist.push([ss, wds])
          // console.log(lrctimelist);
        }
        //遍历每行时间和歌词
        // for(var i=0;i<lrctimelist.length;i++){
        //   // console.log(lrctimelist[i]);
        // }   
      }
    }
    //存储数据
    this.setData({
      songwords: lrctimelist
    })
  },
  //歌词定位
  wordschange: function (res) {
    // console.log(res.detail.currentTime);
    //获取歌曲时间
    var songtime = res.detail.currentTime
    // console.log(songtime);
    //获取歌词时间
    var wdstime = this.data.songwords
    // console.log(wdstime);
    //遍历歌词的二维数组
    for (var i = 0; i < wdstime.length-1; i++) {
      // console.log(wdstime[i][0]);
      //每一句歌词的时间判断：唱歌的区间在大于上一句歌词时间小于下一句歌词时间
      if (wdstime[i][0] < songtime && songtime < wdstime[i + 1][0]) {
        // console.log(wdstime[i][1]);
        //存储数据  存储当前播放歌词的下标
        this.setData({
          index: i
        })
      }
      //滚动条 定位自动播放 
      //拿到index
      var x = this.data.index
      // console.log(x);
      // if (x > 7) {
      //   this.setData({
      //     //每超过5句就向上翻  16是每句歌词行高
      //     top: (x - 7) * 16
      //   }) 
      //   console.log((x - 7) * 16);
      //   break
      // }
    }
    //进度条
    //总时长 res.detail.duration
    //当前播放进度  res.detail.currentTime
    //  console.log(res.detail.duration);
    let timeall = res.detail.duration
    let timecurrent = res.detail.currentTime
    //格式化总时长
    let all_m = Math.floor(timeall / 60)
    let all_s = Math.floor(timeall % 60)
    // console.log(all_m+":"+all_s);
    if (all_m < 10) {
      all_m = "0" + all_m
    }
    if (all_s < 10) {
      all_s = "0" + all_s
    }
    //格式化实时时长
    let current_m = Math.floor(timecurrent / 60)
    let current_s = Math.floor(timecurrent % 60)
    if (current_m < 10) {
      current_m = "0" + current_m
    }
    if (current_s < 10) {
      current_s = "0" + current_s
    }
    this.setData({
      currenttime: current_m + ":" + current_s,
      timeall: all_m + ":" + all_s,
      max: timeall,
      value: timecurrent
    })


  },
   //拖动进度条
   sliderchange:function(e){
    // console.log(e.detail.value);
    var v=e.detail.value
    //更新当前播放时间  setCurrentTime是设置当前播放时间
   this.setData({
     action:{
       mathod:'setCurrentTime',
       data:v
     }
   })
    //更新播放的状态
    this.setData({
      action:{
        method:'play'
      }
    })
  },
  //循环播放图标更改
  playcircle:function(){
    var mode=this.data.mode
    if(mode==="loop"){
      this.setData({
        mode:'single'
      })
    }else{
      this.setData({
        mode:'loop'
      })
    }
    musicchange:()=>{
      if(mode=='single'){
        this.setData({
          musicId:this.data.musicId
        })
      }
     this.setData({
       action:{
         method:'play'
       }
     })
    }

  },
  //循环下一首
  nextsong:function(){
    var music=this.data.music
    var musicList=this.data.musicList
    // console.log(musicList);
    // console.log(music);
    var musicid=this.data.musicId
    // console.log(musicid);
    var idList=this.data.idList
    // console.log(idList);
    var index=-1
    for(var i=0;i<idList.length;i++){
      if(musicid==idList[i]){
        index=i
        break
      }     
    }
     if(index==idList.length-1){
        this.setData({
          musicId:idList[0],
          music:musicList[0]       
        })
      }else{
        this.setData({
          musicId:idList[index+1],
          music:musicList[index+1]
        })
      }
      this.setData({
        action:{
          method:'play'
        }
      })
      this. getplaywords() 
    },
    //切换上一首
  lastsong:function(e){
    var music=this.data.music
    var musicList=this.data.musicList
    // console.log(musicList);
    // console.log(music);
    var musicid=this.data.musicId
    // console.log(musicid);
    var idList=this.data.idList
    // console.log(idList);
    var index=-1
    for(var i=idList.length;i>=0;i--){
      if(musicid==idList[i]){
        index=i
        break
      }     
    }
     if(index==0){
        this.setData({
          musicId:idList[idList.length],
          music:musicList[idList.length]       
        })
      }else{
        this.setData({
          musicId:idList[index-1],
          music:musicList[index-1]
        })
      }
      this.setData({
        action:{
          method:'play'
        }
      })
      this. getplaywords() 
  },
})
 