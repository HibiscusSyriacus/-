import Http from "../utils/http"

class Service{
    /**
     * 分页获取服务列表
     * @param {*} page 页码
     * @param {*} count 每页数量
     * @param {*} category_id 分类id
     * @param {*} type 服务类型
     */
   async getServiceList(page,count,category_id=null,type=null){
     
     const res=await  Http.request({url:'v1/service/list',data:{page,count}})
     console.log(res)
     return res


    }

}

export default Service