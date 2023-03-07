import Tim from "../../model/tim"
import { createStoreBindings } from "mobx-miniprogram-bindings"
import { timStore } from "../../store/tim"

// pages/conversation/conversation.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        targetUserId:null,
        service:null,
        isSent: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            fields: ['sdkReady'],
            actions: ['pushMessage', 'resetMessage', 'getConversationList']
           
        })
        const targetUserId=options.targetUserId
        this.setData({
            targetUserId:targetUserId,
            service: options.service ? JSON.parse(options.service) : null
        })

    },

    handleSendMessage: function (event) {
        const { type, content } = event.detail
        const message = Tim.getInstance().createMessage(type, content, this.data.targetUserId)
        this.pushMessage(message)
        Tim.getInstance().sendMessage(message)
        this.data.isSent = true
        // this.getOpenerEventChannel().emit('sendMessage')
    },
    
    handleLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if (!this.data.isSent) {
            this.getConversationList()
        }
        this.resetMessage()
        this.storeBindings.destroyStoreBindings()
    },


    
})