import cache from "../../enum/cache";
import { setTabBarBadge } from "../../utils/wx";
import Token from "../../model/token";
import User from "../../model/user";
import { appointWithMeGrid, myAppointGrid, myProvideGird, mySeekGrid } from "../../config/grid";
import Order from "../../model/order";
import roleType from "../../enum/role-type";
import Service from "../../model/service";
import serviceType from "../../enum/service-type";
import { getEventParam } from "../../utils/utils";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            nickname: '点击授权登陆',
            avatar: '../../images/logo.png'
        },
          // 宫格配置
        // 预约我的宫格
        appointWithMeGrid: appointWithMeGrid,
        // 我的预约宫格
        myAppointGrid: myAppointGrid,
        // 我在提供宫格
        myProvideGird: myProvideGird,
        // 正在找宫格
        mySeekGrid: mySeekGrid,

        appointWithMeStatus: null,
        myAppointStatus: null,
        provideServiceStatus: null,
        seekServiceStatus: null
      
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow(){
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)

        const verifyToken = await Token.verifyToken();
        if (verifyToken.valid) {
            const userInfo = User.getUserInfoByLocal();
            this.setData({
                userInfo
            })
           this._getOrderStatus()
           this._getServiceStatus()
        }

    },

    async _getOrderStatus() {
        const appointWithMeStatus = Order.getOrderStatus(roleType.PUBLISHER); // 6
        const myAppointStatus = Order.getOrderStatus(roleType.CONSUMER); // 3

        this.setData({
            appointWithMeStatus: await appointWithMeStatus,
            myAppointStatus: await myAppointStatus
        })
    },

    async _getServiceStatus() {
        const provideServiceStatus = Service.getServiceStatus(serviceType.PROVIDE);
        const seekServiceStatus = Service.getServiceStatus(serviceType.SEEK);
        this.setData({
            provideServiceStatus: await provideServiceStatus,
            seekServiceStatus: await seekServiceStatus
        })
    },

    handleNavToOrder(event) {
        const cell = getEventParam(event, 'cell')
        
        if (!('status' in cell)) {
            wx.navigateTo({
                url: `/pages/refund-list/refund-list?role=${cell.role}`
            })
            return
        }

        wx.navigateTo({
            url: `/pages/my-order/my-order?role=${cell.role}&status=${cell.status}`
        })
    },
    handleNavToMyService(event) {
        
        const { type, status } = getEventParam(event, 'cell')
        wx.navigateTo({
            url: `/pages/my-service/my-service?type=${type}&status=${status}`
        })
    },
    
    handleToLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    }
})