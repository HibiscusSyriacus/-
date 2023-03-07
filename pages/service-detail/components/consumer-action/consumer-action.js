import serviceType from "../../../../enum/service-type";

import behavior from "../behavior"

// pages/service-detail/components/consumer-action/consumer-action.js
Component({

    behaviors:[behavior],
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
      serviceTypeEnum:serviceType
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleChat:function(event){
this.triggerEvent('chat')
        },
        handleOrder:function(event){
            this.triggerEvent('order')
        }
    }
})
