import Http from "../utils/http";
import APIConfig from "../config/api";
import cache from "../enum/cache";

class Token {
    static async getToken() {
        const res = await Http.request({
            url: 'v1/token',
            data: {
                i_code: APIConfig.iCode,
                order_no: APIConfig.orderNo
            },
            method: 'POST'
        });
        return res.token
    }

    static async verifyToken() {
        const token = wx.getStorageSync(cache.TOKEN)
        return Http.request({
            url: 'v1/token/verify',
            data: { token },
            method: 'POST'
        })
    }
}

export default Token