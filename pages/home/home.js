import Category from "../../model/category";
import Service from "../../model/service";
const service=new Service()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs:['全部服务','在提供','正在找'],
        categoryList:[]
      
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this._getServiceList()
        this._getCategoryList()
    },

    async _getServiceList(){
        //发起网络请求，获取服务列表
       const serviceList= await service.getServiceList(1,10)
       console.log(serviceList)
       this.setData({
           serviceList:serviceList.data
       })
     
    },

    handleTabChange:function(event){
        console.log(event)
    },

    handleCategoryChange:function(event){
        console.log(event)
        const id=event.currentTarget.dataset.id
    
    },

    async _getCategoryList() {
        const categoryList = await Category.getCategoryListWithAll();
        this.setData({
            categoryList
        })

    },
    
})