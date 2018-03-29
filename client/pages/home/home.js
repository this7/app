var a = Page({
    data: {
        title: "测试标题用户名",
        a:1,
        b:2,
        c:3,
        user: {
            name: 'youngwind',
            age: 24
        },
        order: [{
                sn: 148946545,
                title: 'aaa'
            },
            {
                  sn: 148946546,
                title: 'bbb'
            },
            {
                sn: 148946547,
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