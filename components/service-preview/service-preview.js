import serviceType from "../../enum/service-type";

// components/service-preview/service-preview.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      service:{
        type:Object
    }
    },

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

    }
})
