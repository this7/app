/*
 * @Author: qinuoyun
 * @Date:   2018-02-24 15:10:04
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2018-02-24 15:12:32
 * 配置文件
 */


// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://www.this7.com';

var config = {
    // 以下是页面中的请求地址 都放在service中 方便以后的改动
    service: {
        host,
        //上传图片
        uploadImg: `${host}/api/upload/uploadImg`,

        // 登录地址，用于建立会话
        loginUrl: `${host}/api/login/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/api/login/info`
    }
}