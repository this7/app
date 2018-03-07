var a = Page({
    data: {
        title: "测试标题用户名",
        show: true,
        user: {
            name: 'youngwind',
            age: 24
        },
        items: [{
                title: 'aaa'
            },
            {
                title: 'bbb'
            },
            {
                title: 'ccc'
            }
        ]
    },
    // 用户登录示例
    login: function() {
        console.log("这里是用户登录啦");
    },
    test: function() {
        console.log("点击事件", this);
        this.data.title = "你好啊"
    }
})