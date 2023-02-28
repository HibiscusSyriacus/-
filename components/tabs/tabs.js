// components/tabs/tabs.js
Component({

    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentTabIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleTabChange:function (event){
       
            const index=event.currentTarget.dataset.index
            if(index==this.data.currentTabIndex){
                return 
            }
            this.setData({
                currentTabIndex:index
            })

            this.triggerEvent('change',{index})
          },

          handleTouchMove(event){
            console.log(event)
            //0,-1,1
            const direction=event.direction
            const currentTabIndex=this.data.currentTabIndex
            const targetTabIndex=currentTabIndex+ direction
            if(targetTabIndex<0||targetTabIndex>this.data.tabs.length-1){
                return
            }
            const customEvent={
                currentTarget:{
                    dataset:{
                        index:targetTabIndex
                    }
                }
            }
            this.handleTabChange(customEvent)
          },

        handleTouchstart:function(event){
            console.log(event)
        },


        handleTouchend:function(event){
            console.log(event)
        }
  


    }
})
