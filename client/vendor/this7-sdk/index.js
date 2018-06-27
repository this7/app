/*
 * @Author: qinuoyun
 * @Date:   2018-02-27 14:25:05
 * @Last Modified by:   else
 * @Last Modified time: 2018-06-22 14:44:07
 */
(function() {

    /** 全局ajax对象 */
    var ajax = new Object();
    var ajaxCore = null;

    /**
     * @see 创建ajax核心对象,兼容浏览器有：IE6,7,8,9，谷歌，火狐，欧朋，360极速，360安全，苹果，搜狗，遨游，猎豹，腾讯
     * @return XMLHttpRequest
     */
    ajax.getCore = function() {
        var xmlHttp = null;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp.overrideMimeType) {
                xmlHttp.overrideMimeType("text/xml");
            }
        } else {
            if (window.ActiveXObject) {
                try {
                    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
        }
        if (!xmlHttp) {
            window.alert("\u8bf7\u4f7f\u7528IE\u6d4f\u89c8\u5668!");
        }
        return xmlHttp;
    };

    /**
     * @see 处理ajax参数
     * @param param 参数
     * @return String
     */
    ajax.getParam = function(param) {
        var randomStr = "ajaxParamRandom=" + Math.random();
        if (param == null || param == "") {
            return randomStr;
        }
        var str = "";
        if (typeof(param) == "object") {
            for (var key in param) {
                str += key + "=" + param[key] + "&";
            }
            str = (str.length > 0 ? str.substring(0, str.length - 1) : str);
        } else {
            str = param;
        }
        return str + "&" + randomStr;
    };

    /**
     * @see ajax的回调函数
     * @param callback 用户自定义回调函数
     * @param url 请求的url
     */
    ajax.doCallback = function(callback) {

        if (ajaxCore.readyState == 4) {
            var request = {
                "data": "",
                "errMsg": ajaxCore.statusText,
                "statusCode": ajaxCore.status,
                "header": ajaxCore.getAllResponseHeaders()
            };
            callback.complete(request);
            if (ajaxCore.status == 200) {
                var result = new String(ajaxCore.responseText);

                if (null != result && result != "") {
                    if (result == "null") {
                        callback(null);
                    } else {
                        var backObject = null;
                        if (result == "true" || result == "false") {
                            backObject = eval(result);
                        } else if (!isNaN(result)) {
                            backObject = parseFloat(result);
                        } else if ((result.substring(0, 1) == "[" && result.substring(result.length - 1, result.length) == "]") ||
                            (result.substring(0, 1) == "{" && result.substring(result.length - 1, result.length) == "}")) {
                            backObject = eval("(" + result + ")");
                        } else {
                            backObject = result;
                        }
                        //判断是否为JSON对象
                        if (typeof(backObject) == "object" && Object.prototype.toString.call(backObject).toLowerCase() == "[object object]" && !backObject.length) {
                            if (backObject.code == 0) {
                                callback.success(backObject);
                            } else {
                                callback.error(backObject);
                            }
                        } else {
                            request.data = backObject
                            callback.success(request);
                        }
                    }
                } else {
                    request.data = responseText
                    callback.success(request);
                }
            } else {
                request.data = responseText
                callback.fail(request);
            }
        }
    };

    /**
     * 批处理构造函数
     * @constructor
     */
    function client() {
        //return this;
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
     * @Author   Sean       Yan
     * @DateTime 2018-06-22
     * @param    {[type]}   object [description]
     * @return   {[type]}          [description]
     * 返回对象:data,errMsg,header,statusCode
     */
    client.ajax = function(objects) {
        ajaxCore = ajax.getCore();
        var options = {
            /**
             * ajax 请求地址
             * @type {String}
             */
            url: '',
            /**
             * 请求的方法,默认为GET
             * @type {String}
             */
            method: 'GET',
            /**
             * 请求的数据
             * @type {Object/String/ArrayBuffer}
             */
            data: null,
            /**
             * 请求头部
             * @type {Object}
             */
            header: '',
            /**
             * 请求的类型,默认为json
             * @type {String}
             */
            dataType: 'json',
            /**
             * 设置响应的数据类型
             * 合法值：text、arraybuffer
             * @type {String}
             */
            responseType: 'text',
            /**
             * 超时时间，默认5秒钟
             * @type {Number}
             */
            timeout: 5000,
            /**
             * 接口调用结束的回调函数
             * （调用成功、失败都会执行）
             * @return {[type]} [description]
             */
            complete: function(e) {

            },
            /**
             * 接口调用失败的回调函数
             * @return {[type]} [description]
             */
            fail: function(e) {

            },
            /**
             * 收到开发者服务成功返回的回调函数 
             * @return {[type]} [description]
             */
            success: function(e) {

            },
            /**
             * API返回错误接口
             * @return {[type]} [description]
             */
            error: function(e) {

            }
        }

        for (i in options) {
            if (objects[i] === undefined) {
                objects[i] = options[i];
            }
        }

        //判断AJAX是否为空
        if (ajaxCore != null) {
            //执行数据回调
            ajaxCore.onreadystatechange = function() {
                ajax.doCallback(objects);
            };

            //传输类型
            if (objects.method == "GET") {
                ajaxCore.open("GET", objects.url, true);
            } else {
                ajaxCore.open("POST", objects.url, true);
            }

            //设置自定义头部
            if (typeof(objects.header) == 'object') {
                var header = objects.header;
                for (i in header) {
                    ajaxCore.setRequestHeader(i, header[i]);
                }
            }

            //数据发送
            if (objects.method == "GET") {
                ajaxCore.send(null);
            } else {
                ajaxCore.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                ajaxCore.send(ajax.getParam(objects.data));
            }

        }

    }


    client.request = function() {

    }

    /**
     * @see ajax的post请求
     * @param url 请求的url
     * @param callback 用户自定义回调函数
     */
    client.get = function(url, callback) {
        var options = {
            complete: function(e) {},
            fail: function(e) {},
            success: function(e) {},
            error: function(e) {}
        }
        options.success = callback;
        ajaxCore = ajax.getCore();
        if (ajaxCore != null) {
            ajaxCore.onreadystatechange = function() {
                ajax.doCallback(options, url);
            };
            ajaxCore.open("GET", url, true);
            ajaxCore.send(null);
        }
    };

    /**
     * @see ajax的get请求
     * @param url 请求的url
     * @param callback 用户自定义回调函数
     */
    client.post = function(url, data, callback) {
        var options = {
            complete: function(e) {},
            fail: function(e) {},
            success: function(e) {},
            error: function(e) {}
        }
        options.success = callback;
        ajaxCore = ajax.getCore();
        if (ajaxCore != null) {
            ajaxCore.onreadystatechange = function() {
                ajax.doCallback(callback, url);
            };
            ajaxCore.open("POST", url, true);
            ajaxCore.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajaxCore.send(ajax.getParam(data));
        }
    };

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