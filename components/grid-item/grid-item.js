Component({
    relations: {
        '../grid/grid': {
            type: 'parent'
        }
    },
    properties: {
        icon: String,
        iconSize: {
            type: String,
            value: '50'
        },
        text: String,
        showBadge: Boolean,
        badgeCount: Number,
        cell: Object
    },
    data: {},
    methods: {
        handleSelect: function () {
            this.triggerEvent('select',
                { cell: this.data.cell },
                // 事件冒泡
                { bubbles: true, composed: true }
            )
        }
    }
});
