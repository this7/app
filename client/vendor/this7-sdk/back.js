/*
 * @Author: qinuoyun
 * @Date:   2018-02-27 14:25:05
 * @Last Modified by:   else
 * @Last Modified time: 2018-06-22 10:15:55
 */
(function() {
    /**
     * 批处理构造函数
     * @constructor
     */
    function client() {
        //return this;
    }
    /**
     * 批处理充值
     */
    client.prototype.reset = function() {
        this.has = {};
        this.queue = [];
        this.waiting = false;
    };

    /**
     * 获取Token秘钥
     * @return {[type]}      [description]
     */
    client.getToken = function() {
        return 'this720180611';
    }

    client.loadingShow = function(argument) {
        console.log("正在加载……");
    }

    client.commonError = function(argument) {
        console.log("出错啦");
    }

    client.ajaxError = function(argument) {
        console.log("AJAJX出错啦");
    }

    /**
     * 合并数组对象
     * @param  {[type]} to   [description]
     * @param  {[type]} from [description]
     * @return {[type]}      [description]
     */
    client.extend = function(to, from) {
        for (let key in from) {
            to[key] = from[key];
        }
    };

    /**
     * 数据请求
     * @param  {[type]} options [description]
     * @param  {[type]} type    [description]
     * @return {[type]}         [description]
     */
    client.request = function(options, type) {
        var opts = {
            isCommonBefore: true, //默认是通用的加载中动画
            isCors: false, //默认不跨域
            isLogin: false
        }
        this.extend(opts || {}, options);
        //跨域，将请求地址 和 请求参数 都作为参数传递调用后台固定的跨域接口
        if (opts.isCors) {
            opts.data = {
                url: opts.url, //真实的url
                params: JSON.stringify(opts.data), //请求参数
            }
            opts.url = 'http://www.baidu.com';
        }

        //需要登录认证的请求
        if (opts.isLogin) {
            opts.data.token = client.getToken()
        }

        client.ajax({
            url: opts.url,
            data: opts.data,
            type: type,
            async: opts.async,
            beforeSend: function() {
                opts.isCommonBefore ? client.loadingShow() : (opts.beforeSend && opts.beforeSend())
            },
            success: function(json) {
                if (json) {
                    opts.success && json.code === 0 && opts.success(json);
                    //区分不同的状态码回调函数
                    if (opts[json.code] && json.code != 900) {
                        eval(opts[json.code])(json);
                    } else if (json.code == 900) {
                        console.group("PHP调试器");
                        var content = json.error + '在文件[' + json.file + ']第 ' + json.line + ' 行';
                        if (json.type == 'error') {
                            console.error("致命错误：", content);
                        }
                        if (json.type == 'warn') {
                            console.warn("警告错误：", content);
                        }
                        if (json.type == 'info') {
                            console.info("提示信息：", content);
                        }
                        if (json.traces) {
                            for (var i = 0; i < json.traces.length; i++) {
                                var content = json.traces[i]['message'] + '在文件[' + json.traces[i]['file'] + ']第 ' + json.traces[i]['line'] + ' 行';
                                console.log("#" + i + ":", content);
                            }
                        }
                        console.groupEnd();
                    } else {
                        opts.error(json)
                    }
                } else {
                    //ajax 数据返回格式异常
                    client.ajaxError();
                }
            },
            error: function() {
                console.error(opts.baseUrl || opts.url, ' ajax is error');
                opts.error != undefined ? opts.error() : client.commonError();
            },
            complete: function(XMLHttpRequest, textStatus) {
                console.log(opts.baseUrl || opts.url, ' ajax is complete');
            },
            timeout: opts.timeout || 20000
        })
    };


    client.ajax = function(opts) {
        var defaultOpts = {
            /**
             * ajax 请求地址
             * @type {String}
             */
            url: '',
            /**
             * 请求的方法,默认为GET
             * @type {String}
             */
            type: 'GET',
            /**
             * 请求的数据
             * @type {[type]}
             */
            data: null,
            /**
             * 请求头部
             * @type {String}
             */
            contentType: '',
            /**
             * 请求的类型,默认为json
             * @type {String}
             */
            dataType: 'json',
            /**
             * 是否异步，默认为true
             * @type {Boolean}
             */
            async: true,
            /**
             * 超时时间，默认5秒钟
             * @type {Number}
             */
            timeout: 5000,
            /**
             * 发送之前执行的函数
             * @return {[type]} [description]
             */
            before: function() {

            },
            /**
             * 错误执行的函数
             * @return {[type]} [description]
             */
            error: function() {
                console.log('error')
            },
            /**
             * 请求成功的回调函数
             * @return {[type]} [description]
             */
            success: function() {
                console.log('success')
            }
        }

        for (i in defaultOpts) {
            if (opts[i] === undefined) {
                opts[i] = defaultOpts[i];
            }
        }

        var xhr = null;

        var ajax = {
            init: function() {
                opts.before();
                ajax.getData();
                opts.dataType === "jsonp" ? ajax.createJsonp() : ajax.createXHR();
            },

            options: {
                timeoutFlag: null, //超时标识
                timeoutBool: false //是否请求超时
            },

            /**
             * 解析参数数据
             * @return {[type]} [description]
             */
            getData: function() {
                var name, value;
                if (opts.data) {
                    if (typeof opts.data === "string") {
                        opts.data = opts.data.split("&");
                        for (var i = 0, len = opts.data.length; i < len; i++) {
                            name = opts.data[i].split("=")[0];
                            value = opts.data[i].split("=")[1];
                            opts.data[i] = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                        }
                        opts.data = opts.data.replace("/%20/g", "+");
                    } else if (typeof opts.data === "object") {
                        var arr = [];
                        for (var name in opts.data) {
                            var value = opts.data[name].toString();
                            name = encodeURIComponent(name);
                            value = encodeURIComponent(value);
                            arr.push(name + "=" + value);
                        }
                        opts.data = arr.join("&").replace("/%20/g", "+");
                    }

                    //使用GET方法或JSONP，则手动添加到URL中
                    if (opts.type === "GET" || opts.dataType === "jsonp") {
                        opts.url += opts.url.indexOf("?") > -1 ? opts.data : "?" + opts.data;
                    }
                }
            },

            /**
             * 创建jsonp
             * @return {[type]} [description]
             */
            createJsonp: function() {
                var script = document.createElement("script"),
                    timeName = new Date().getTime() + Math.round(Math.random() * 1000),
                    callback = "jsonp_" + timeName;

                window[callback] = function(data) {
                    clearTimeout(ajax.options.timeoutFlag);
                    document.body.removeChild(script);
                    try {
                        data && (data = JSON.parse(data));
                    } catch (e) {
                        console.error('ajax error for json parse responseText');
                    }
                    ajax.success(data);
                }
                script.src = url + (url.indexOf("?") > -1 ? "" : "?") + "callback=" + callback;
                script.type = "text/javascript";
                document.body.appendChild(script);
                ajax.timeout(callback, script);
            },

            /**
             * 设置请求超时
             * @param  {Function} callback [description]
             * @param  {[type]}   script   [description]
             * @return {[type]}            [description]
             */
            timeout: function(callback, script) {
                if (opts.timeout !== undefined) {
                    ajax.options.timeoutFlag = setTimeout(function() {
                        if (opts.dataType === "jsonp") {
                            delete window[callback];
                            document.body.removeChild(script);
                        } else {
                            ajax.options.timeoutBool = true;
                            xhr && xhr.abort();
                        }
                    }, opts.timeout);
                }
            },

            /**
             * 兼容IE6，XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的
             * @return {[type]} [description]
             */
            getXHR: function() {

                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else {
                    //遍历IE中不同版本的ActiveX对象
                    var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                    for (var i = 0; i < versions.length; i++) {
                        try {
                            var version = versions[i] + ".XMLHTTP";
                            return new ActiveXObject(version);
                        } catch (e) {
                            console.log('error ajax', e)
                        }
                    }
                }
            },

            /**
             * 创建XHR
             * @return {[type]} [description]
             */
            createXHR: function() {
                //创建对象
                xhr = ajax.getXHR();
                xhr.open(opts.type, opts.url, opts.async);
                //设置请求头
                if (opts.type === "POST" && !opts.contentType) {
                    //若是post提交，则设置content-Type 为application/x-www-four-urlencoded
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                } else if (opts.contentType) {
                    xhr.setRequestHeader("Content-Type", opts.contentType);
                }
                //设置客户端key
                xhr.setRequestHeader("x-this7-code", 'this720180611');
                xhr.setRequestHeader("x-this7-key", '1111111111111112121');
                //添加监听
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (opts.timeout !== undefined) {
                            //由于执行abort()方法后，有可能触发onreadystatechange事件，
                            //所以设置一个ajax.options.timeoutBool标识，来忽略中止触发的事件。
                            if (ajax.options.timeoutBool) {
                                return;
                            }
                            clearTimeout(ajax.options.timeoutFlag);
                        }
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            var responseText = xhr.responseText;
                            try {
                                xhr.responseText && (responseText = JSON.parse(responseText));
                                opts.success(responseText);
                            } catch (e) {
                                console.group("AJAX错误提示：");
                                console.error("返回格式错误：", 'json解析responseText的ajax错误');
                                console.warn("详细信息：", { "body": xhr.responseText });
                                console.groupEnd();
                            }
                        } else {
                            opts.error(xhr);
                        }
                    }
                };
                //发送请求
                xhr.send(opts.type === "GET" ? null : opts.data);
                ajax.timeout(); //请求超时    
            }
        }
        ajax.init();
    }

    // AMD && CMD
    if (typeof define === 'function') {
        define(function() {
            return client;
        });
        // CommonJS
    } else if (typeof module !== "undefined" && module !== null) {
        module.exports = client;
        // window
    } else {
        window.client = client;
    }
})();