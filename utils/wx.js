/**
 * 原生API转换为promise对象
 * @param {*} method 
 * @param {*} options 
 */

export  default  function wxToPromise(method,options={}){
    return new Promise((resolve,reject)=>{
        options.success=resolve
        options.fail=err=>{
            reject(err)
        }
        wx[method](options)
    })
}