/**
 * 评价模型
 */
import Base from "./base";
import Http from "../utils/http";

class Rating extends Base {
    async getServiceRatingList(serviceId) {
        if (!this.hasMoreData) {
            return this.data
        }

        // 发起网络请求，获取数据
        const ratingList = await Http.request({
            url: 'v1/rating/service',
            data: {
                page: this.page,
                count: this.count,
                service_id: serviceId
            }
        },)
        this.data = this.data.concat(ratingList.data)
        this.hasMoreData = !(this.page === ratingList.last_page)
        this.page++
        return this.data
    }

    static async getRatingByOrderId(orderId) {
        return Http.request({
            url: 'v1/rating/order',
            data: {
                order_id: orderId
            }
        })
    }

    static async createRating(order_id, score, content, illustration) {
        return Http.request({
            url: 'v1/rating',
            data: {
                order_id, score, content, illustration
            },
            method: 'POST'
        })
    }
}

export default Rating