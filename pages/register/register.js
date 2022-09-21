// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:"",
    confirm:"",
    nickname:"",
    mag:"false"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handInput: function (e) {
    // console.log(e);
    // console.log(e.detail.value);
    // console.log(e.currentTarget.dataset.type);
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    this.setData({
      [type]: value
    })
  },

  login: function () {
    //1.收集表单数据
    let { phone, password } = this.data
    // console.log({phone,password});  
    //2.前端验证
    //(1）手机号验证
    //如果手机号为空
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    //手机号格式要正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    //（2）密码验证
    else if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
      })
      return
    }
    // console.log(password.length);
    else if (password.length < 6 ) {
      wx.showToast({
        title: '密码长度大于6位',
        icon: 'none'
      })
      return
    }
    else if (!phone && !password) {
      wx.showToast({
        title: '请填写信息',
        icon: 'none',
      })
    }  
    var confirm=this.data.confirm
    // console.log(confirm);
     //验证码验证
     wx.request({    
      url: 'http://localhost:3000/captcha/verify?'+'phone='+phone+'&captcha='+confirm,
      success:(res)=>{
        // console.log(res);
        if(res.data.data==false){
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
          })
        }
      }
    })
    var nickname=this.data.nickname
   wx.request({
     url: 'http://localhost:3000/register/cellphone?'+'phone='+phone+'&password='+password+'&captcha='+confirm+'&nickname='+nickname,
     success:(res)=>{
      //  console.log(res);
       wx.request({
        url: 'http://localhost:3000/captcha/sent?phone='+phone,
        success:(res)=>{
          // console.log(res);
          if(res.data.code==200){
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
     }
     
   })
  },
  confirm:function(){
    let phone=this.data.phone
    // console.log(phone);
     //(1）手机号验证
    //如果手机号为空
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    //手机号格式要正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    
  },
  
  
})