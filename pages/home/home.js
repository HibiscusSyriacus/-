import Category from "../../model/category";
import Service from "../../model/service";
import Tim from "../../model/tim";
import cache from "../../enum/cache";
import { debounce,throttle } from "../../utils/utils";
import { setTabBarBadge } from "../../utils/wx";

const service=new Service()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs:[' 全部服务','在提供','正在找'],
        categoryList:[],
        tabIndex:0,
        CategoryId:0,
        loading:true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function(options) {
      
      await this._getServiceList()
      await this._getCategoryList()
        this.setData({
          loading:false
        })
   
    },
    onShow(){
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)

    },

   async _getServiceList(){
        //发起网络请求，获取服务列表
     const serviceList= await service.reset().getServiceList(this.data.CategoryId,
      this.data.tabIndex)
     this.setData({
         serviceList:serviceList
     })
    },

    handleTabChange:function(event){
        
        this.data.tabIndex=event.detail.index
        this._getServiceList()
        
    },

    handleCategoryChange:throttle(function(event){
      if(this.data.CategoryId===event.currentTarget.dataset.id){
        return 
      }
     this.data.CategoryId=event.currentTarget.dataset.id
     this._getServiceList()
      
   }) ,
   handleSelectService:function(event){
    console.log(event)
    const service=event.currentTarget.dataset.service
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?service_id=`+service.id,
    })

},

    async _getCategoryList(){
       const categoryList= await Category.getCategoryListWithAll();
       this.setData({
        categoryList
       })
    },
    

    

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
     this._getServiceList
      wx.stopPullDownRefresh()

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
     
      if(!service.hasMoreData){
        return
    }
    const serviceList= await service.getServiceList(this.data.CategoryId,this.data.tabIn)
    this.setData({serviceList})


    },


})