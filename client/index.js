var pages = { 'index/index': true };
var this_sn = '423809829038592829348';

function Page(funs) {
    /**
     * 获取页面模板信息
     * @type {[type]}
     */
    var tpl = document.getElementById('template').innerHTML;
    var compiled_tpl = juicer(tpl);
    var html = compiled_tpl.render(funs.data);
    document.getElementById('app').innerHTML = html;


    /**
     * 创建自定义函数
     */
    funs.setData = function(markers) {
        var array = this.data;
        for (var key in markers) {
            array[key] = markers[key];
        }
        this.data = array;
        var html = compiled_tpl.render(funs.data);
        document.getElementById('app').innerHTML = html;
    }

    /**
     * 事件调用
     */
    $(document).on('click', '[bindtap]', function(event) {
        event.preventDefault();
        var __fun = $(this).attr("bindtap");
        var e = { UID: 111 }
        var fuaName = 'funs.' + __fun + "(e)";
        console.log($(this));
        eval(fuaName);
        //window[fuaName]();
    });

    /**
     * 设置运行周期
     */
    funs.onShow();

}


var wx = {
    /**
     * 页面跳转
     * @param  {[type]} funs [description]
     * @return {[type]}      [description]
     */
    navigateTo: function(funs) {
        var newstr = funs.url.split('?');
        var url = '';
        console.log(newstr);
        newstr.forEach(function(value, index, array) {
            if (index == 0) {
                var val = value.split('/');
                for (var i = 0; i < val.length; i++) {
                    url += '/' + val[i];
                }

            } else {
                var val = value.split('=');
                for (var i = 0; i < val.length; i++) {
                    url += '/' + val[i];
                }
            }　
        });
        window.location.href = url;
    },
    /**
     * 页面返回
     * @param  {[type]} funs [description]
     * @return {[type]}      [description]
     */
    navigateBack: function(funs) {
        window.history.back(funs.data);
    },
    /**
     * 判断是否设置
     * @param  {[type]} variableName [description]
     * @return {[type]}              [description]
     */
    isset: function(variableName) {
        try {
            if (typeof(variableName) == "undefined") {
                return false;
            } else {
                return true;
            }
        } catch (e) {}
        return false;
    },
    /**
     * 用户登录
     * @return {[type]} [description]
     */
    login: function(data) {
        var funs = {};
        funs.header = {}
        if (this.isset(data.url)) {
            funs.url = data.url;
        }
        if (this.isset(data.username) && this.isset(data.password)) {
            funs.header = {
                'x-this7-code': 'www.this7.com',
                'x-this7-username': data.username,
                'x-this7-password': data.password
            };
        }
        funs.method = 'POST';
        funs.dataType = 'JSON';
        if (this.isset(data.success)) {
            funs.success = data.success;
        }
        if (this.isset(data.fail)) {
            funs.fail = data.fail;
        }
        this.request(funs);
    },
    /**
     * 数据请求
     * @param  {[type]} funs [description]
     * @return {[type]}      [description]
     */
    request: function(funs) {
        var url = funs.url || '';
        var data = funs.data || null;
        var method = 'GET';
        var xhr = null;
        var that = this;
        var dataType = 'JSON'; //JSON|TEXT

        if (this.isset(funs.method)) {
            method = funs.method.toUpperCase();
        }

        if (this.isset(funs.dataType)) {
            dataType = funs.dataType.toUpperCase();
        }

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }

        //用于清除缓存
        var random = Math.random();

        //数据格式化
        if (typeof data == 'object') {
            var str = '';
            for (var key in data) {
                str += key + '=' + data[key] + '&';
            }
            data = str.replace(/&$/, '');
        }

        if (method == 'GET') {
            if (data) {
                xhr.open('GET', url + '?' + data, true);
            } else {
                xhr.open('GET', url + '?t=' + random, true);
            }
            //自定义头部信息
             xhr.setRequestHeader("x-this7-client", 'this7_client');
            if (this.isset(funs.login)) {
                xhr.setRequestHeader("x-this7-sky", this7_sky);
            }
            if (this.isset(funs.header)) {
                var hd = funs.header;
                for (var key in hd) {
                    xhr.setRequestHeader(key, hd[key]);
                }
            }
            xhr.send();

        } else if (method == 'POST') {
            xhr.open('POST', url, true);
            // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //自定义头部信息
            xhr.setRequestHeader("x-this7-client", 'this7_client');
            if (this.isset(funs.login)) {
                xhr.setRequestHeader("x-this7-sky", this7_sky);
            }
            if (this.isset(funs.header)) {
                var hd = funs.header;
                for (var key in hd) {
                    xhr.setRequestHeader(key, hd[key]);
                }
            }
            xhr.send(data);
        }


        // 处理返回数据
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var returns = {
                        data: xhr.responseText,
                        header: {
                            'Cache-Control': xhr.getResponseHeader('Cache-Control'),
                            'Connection': xhr.getResponseHeader('Connection'),
                            'Content-Type': xhr.getResponseHeader('Content-Type'),
                            'Date': xhr.getResponseHeader('Date'),
                            'Expires': xhr.getResponseHeader('Exprires'),
                            'Pragma': xhr.getResponseHeader('Pragma'),
                            'Server': xhr.getResponseHeader('Server'),
                            'Set-Cookie': document.cookie,
                            'Transfer-Encoding': xhr.getResponseHeader('Transfer-Encoding'),
                            'X-Powered-By': xhr.getResponseHeader('X-Powered-By'),
                        },
                        statusCode: xhr.status,
                        errMsg: "request:ok"
                    };
                    if (that.isset(funs.success)) {
                        if (dataType == 'JSON') {
                            returns.data = JSON.parse(xhr.responseText);
                        }
                        if(!returns.data){
                            returns.data = xhr.responseText;
                        }
                        funs.success(returns);
                    }
                } else {
                    if (failed) {
                        if (that.isset(funs.fail)) {
                            funs.fail(xhr.status);
                        }
                    }
                }
            }
        }
    }

};