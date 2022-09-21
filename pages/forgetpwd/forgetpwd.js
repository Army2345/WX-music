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
    wx.request({
      url: 'http://localhost:3000/login/cellphone?' + "phone=" + phone + "&password=" + password,
      success: (res) => {
        // console.log(res);
        // console.log(res.data.profile);
        // console.log(res.data.code);
        let codenum = res.data.code
        // console.log(codenum);
        if (codenum === 200) {
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          //本地存储数据：将用户用户相关信息存储到本地userInfo中，方便跳转页面读取 (同步)
            // 同步接口立即写入  
            wx.setStorageSync('userInfo',JSON.stringify(res.data.profile) )
            // console.log('写入userInfo成功')         
          //登录成功后跳转到主页面
          wx.reLaunch({
            url: '/pages/my/my',
          })
        }
        else if (codenum === 400) {
          wx.showToast({
            title: '手机号有误',
            icon: 'none'
          })
        }
        else if (codenum === 502) {
          wx.showToast({
            title: '密码有误',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '登录失败，请重新登录',
            icon: 'none'
          })
        }
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