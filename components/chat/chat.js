Component({
    properties: {
        userInfo: Object
    },
    data: {},
    methods: {
        handleToChat() {
            this.triggerEvent('chat',
                { targetUserId: this.data.userInfo.id })
        }
    }
});
