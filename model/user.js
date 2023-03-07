import Token from "./token"
import Http from "../utils/http"

import cache from "../enum/cache"



class User{
    static getUserInfoByLocal() {
        return wx.getStorageSync(cache.USER_INFO)
    }

  static async login(){
      //获取令牌
      const token=await Token.getToken()
      wx.setStorageSync(cache.TOKEN, token)
  }
  static async updateUserInfo(userInfo){
    const res=await Http.request({
        url:'v1/user',
        data:{
            nickname:userInfo.nickName,
            avatar:userInfo.avatarUrl,
            gender:userInfo.gender
        },
        method:'PUT'
    })
    console.log(res)
    wx.setStorageSync(cache.USER_INFO, res)
}


}
export default User