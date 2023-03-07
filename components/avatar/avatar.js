Component({
    properties: {
        // 头像地址
        src: String,
        // 展示文本
        text: String,
        // 头像形状，可选：1. square 方形；2. circle
        shape: {
            type: String,
            value: 'square'
        },
        // 头像边框半径，当 shape 等于 circle 时这个配置无效
        radius: {
            type: String,
            value: '0'
        },
        // 头像大小
        size: {
            type: String,
            value: '120'
        },
        // 展示文本的字体大小
        fontSize: {
            type: String,
            value: '28'
        }
    },
    data: {},
    methods: {}
  });