import APIConfig from "../config/api"
import wxToPromise from "./wx"

class Http{
    static async request({url,data,method='GET'}){
      const res= await wxToPromise('request',{url:APIConfig.baseUrl+url,
            data,
            method,
        })

     
            //TODO 请求成功
            if(res.statusCode<400){
                // // console.log(res.data.data)
                //  callback(res.data.data)
                 return res.data.data
             }
             //TODO 请求失败
             if(res.statusCode===401){
                 //TODO 令牌相关的操作
                 return
             }
             Http._showError(res.data.error_code,res.data.message)



        
                
    }
    static  _showError(errorCode,message){
        console.log(errorCode)
        let title=''
       const errorMessage= exceptionMessage[errorCode];
        title=errorMessage||message||'未知异常'
       title= typeof title==='object'?Object.values(title).join(';'):title

        wx.showToast({
            title,
            icon:'none',
            duration:3000,
        })
        console.log(errorMessage)
    }



}

export default Http