//client/home.js
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log("生命周期函数--监听页面显示");
        wx.request({
            url: 'http://www.this7.com/api/demo/index',
            success: function(argument) {
                console.log(argument);
            },
            fail: function(argument) {
                console.log(argument);
            }
        })
    }
});