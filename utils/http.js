import APIConfig from "../config/api";
import wxToPromise from "./wx";
import cache from "../enum/cache";
import User from "../model/user";
import exceptionMessage from "../config/exception-message";

class Http{

    static async request({url,data,method='GET',refetch=true}){
        let res
        try{
       res= await wxToPromise('request',{
          url:APIConfig.baseUrl+url,
            data,
            method,
            header:{
                token:wx.getStorageSync(cache.TOKEN)
            }
        })
    }catch(e){
        
        Http._showError(-1)
        throw new Error(e.errMsg)
    }
     
            //TODO 请求成功
            if(res.statusCode<400){
                // // console.log(res.data.data)
                //  callback(res.data.data)
                 return res.data.data
             }
             //TODO 请求失败
             if(res.statusCode===401){

                this.storeBindings=createStoreBindings(this,{
                    store:timStore,
                    fields:['sdkReady'],
                    actions:{timLogout:'logout'},
                   
                })
                 //TODO 令牌相关的操作
                 if(res.data.error_code===10001){
                     if(this.sdkReady){
                         this.timLogout()
                     }
                    wx.navigateTo({
                      url: '/pages/logins/login',
                    })
                    throw Error('请求未携带令牌')
                }
                if(refetch){
                    return await Http._refetch({url,data,method,refetch})
                }
                if(this.sdkReady){
                    this.timLogout()
                }
               
             }
             Http._showError(res.data.error_code,res.data.message)
             const error = Http._generateMessage(res.data.message)
             throw Error(error)
        
                
    }

    static async _refetch(data) {
        await User.login()
        data.refetch = false
        return await Http.request(data)
    }

    static  _showError(errorCode,message){
        console.log(errorCode)
        let title=''
       const errorMessage= exceptionMessage[errorCode];
        title=errorMessage||message||'未知异常'
       title=Http._generateMessage(title)

        wx.showToast({
            title,
            icon:'none',
            duration:3000,
        })
        console.log(errorMessage)
    }

    static _generateMessage(message) {
        return typeof message === 'object'
            ? Object.values(message).join(';')
            : message
    }

}

export default Http