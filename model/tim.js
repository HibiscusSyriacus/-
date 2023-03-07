import TIM from 'tim-wx-sdk-ws';
import TIMUploadPlugin from 'tim-upload-plugin';
import timConfig from '../config/tim';
import User from './user';
import genTestUserSig from '../lib/tim/generate-test-usersig';


class Tim {
    /**
     * @type(Tim)
     */
    static instance = null
    _SDKInstance = null
    _nextReqMessageId = null
    _messageList = []

    constructor() {

        let tim = TIM.create(timConfig.options);
        tim.setLogLevel(timConfig.logLevel);
        tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
        this._SDKInstance = tim
    }
    static getInstance() {
        if (!Tim.instance) {
            Tim.instance = new Tim()
        }
        return Tim.instance
    }

    getSDK() {
        return this._SDKInstance
    }

    login() {
        const userInfo = User.getUserInfoByLocal()
        console.log(userInfo.id)

        const textUserSig = genTestUserSig(userInfo.id + "")

        this._SDKInstance.login({
            userID: userInfo.id + "",
            userSig: textUserSig.userSig
        })
    }
    logout() {
        this._SDKInstance.logout()
    }
    async getUserProfile(targetUserId) {
        const res = await this._SDKInstance.getUserProfile({
            userIDList: [targetUserId]
        })
        return res.data
    }

    async updateUserProfile(userInfo) {
        await this._SDKInstance.updateMyProfile({
            nick: userInfo.nickname,
            avatar: userInfo.avatar,
            gender: userInfo.gender === 1 ? TIM.TYPES.GENDER_MALE : TIM.TYPES.GENDER_FEMALE
        })
    }
    async getConversationList() {
        const res = await this._SDKInstance.getConversationList()
        return res.data.conversationList
    }

    async getConversationProfile(targetUserId) {
        const res = await this._SDKInstance.getConversationProfile(`C2C${targetUserId}`)
        return res.data.conversation
    }
    
    async getMessageList(targetUserId, count = 10) {
        if (this.isCompleted) {
            return this._messageList
        }

        const res = await this._SDKInstance.getMessageList({
            conversationID: `C2C${targetUserId}`,
            nextReqMessageID: this._nextReqMessageID,
            count: count > 15 ? 15 : count,
            direction: 1
        })
        this._nextReqMessageID = res.data.nextReqMessageID
        this.isCompleted = res.data.isCompleted
        this._messageList = res.data.messageList

        return this._messageList
    }

    async setMessageRead(targetUserId) {
        const res = await this._SDKInstance.setMessageRead({
            conversationID: `C2C${targetUserId}`
        });
        return res.data
    }

    createMessage(type, content, targetUserId, extension = null) {
        let message
        const params = {
            to: targetUserId,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: null
        }
        switch (type) {
            case TIM.TYPES.MSG_TEXT:
                params.payload = { text: content }
                message = this._SDKInstance.createTextMessage(params)
                break
            case TIM.TYPES.MSG_IMAGE:
                params.payload = { file: content }
                message = this._SDKInstance.createImageMessage(params)
                break
            case TIM.TYPES.MSG_CUSTOM:
                params.payload = {
                    data: 'service',
                    description: JSON.stringify(content),
                    extension
                }
                message = this._SDKInstance.createCustomMessage(params)
                break
            default:
                throw Error('未知消息类型')
        }
        return message
    }

    async sendMessage(message) {
        this._SDKInstance.sendMessage(message)
    }

    reset() {
        this._nextReqMessageID = ''
        this.isCompleted = false
        this._messageList = []
        return this
    }
}
export default Tim