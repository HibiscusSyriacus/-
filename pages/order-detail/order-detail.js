import orderStatus from "../../enum/order-status";
import Rating from "../../model/rating";
import roleType from "../../enum/role-type";
import { getEventParam } from "../../utils/utils";
import Order from "../../model/order";
import orderAction from "../../enum/order-action";

Page({
    data: {
        order: null,
        role: null,
        rating: null,
        orderStatus: orderStatus,
        roleType: roleType
    },
    onLoad: function (options) {
        const order = JSON.parse(options.order)
        const role = parseInt(options.role)

        this.setData({
            order,
            role
        })

        if (order.status === orderStatus.COMPLETED) {
            this._getRating(order.id)
        }
    },

    async _getRating(orderId) {
        const rating = await Rating.getRatingByOrderId(orderId);
        this.setData({
            rating
        })
    },

    async _getOrderById() {
        const order = await Order.getOrderById(this.data.order.id)
        this.setData({
            order
        })
    },

    handleToChat(event) {
        const targetUserId = getEventParam(event, 'targetUserId')
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(this.data.order.service_snap)}`
        })
    },

    handleRefund: function () {
        wx.navigateTo({
            url: `/pages/refund/refund?order=${JSON.stringify(this.data.order)}`
        })
    },

    handleRating() {
        wx.navigateTo({
            url: `/pages/rating/rating?order=${JSON.stringify(this.data.order)}`,
            events: {
                rating: () => {
                    this._getOrderById()
                    this._getRating(this.data.order.id)
                }
            }
        })
    },

    async handlePay() {
        const res = await wx.showModal({
            title: '注意',
            content: `您即将支付该服务费用：${this.data.order.price}元，是否确认支付`
        });

        if (!res.confirm) {
            return
        }

        await Order.updateOrderStatus(this.data.order.id, orderAction.PAY)
        wx.navigateTo({
            url: '/pages/pay-success/pay-success'
        })
    },

    async handleUpdateOrderStatus(event) {
        const action = getEventParam(event, 'action')
        const content = this._generateModalContent(action)

        const res = await wx.showModal({
            title: '注意',
            content
        })

        if (!res.confirm) {
            return
        }

        wx.showLoading({ title: '正在提交', mask: true })
        await Order.updateOrderStatus(this.data.order.id, action)
        wx.hideLoading()
        this._getOrderById()
    },

    _generateModalContent(action) {
        let content
        switch (action) {
            case orderAction.AGREE:
                content = '是否确认同意本次服务预约，同意后不可以撤销。'
                break;
            case orderAction.DENY:
                content = '是否确认拒绝本次服务预约，同意后不可以撤销。'
                break;
            case orderAction.CONFIRM:
                content = '是否确认本次服务已完成？'
                break;
            case orderAction.CANCEL:
                content = '是否确认取消本次服务订单，确认取消后不可以撤销。'
                break;
        }

        return content
    },
});