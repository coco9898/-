var t = getApp();

Page({
    data: {
        emolistAPI: t.servPreURL + "emolist",
        pkgSortList: [],
        tip: "数据加载中..."
    },
    getEmolist: function() {
        var e = this, i = {
            openid: wx.getStorageSync("weshine::openid") || ""
        };
        t.fetchWeshineData({
            method: "post",
            url: e.data.emolistAPI,
            requestData: i
        }, function(t) {
            if (200 == t.meta.status) {
                var i = t.data.filter(function(t) {
                    return "热门" != t.title;
                });
                e.setData({
                    pkgSortList: i,
                    tip: ""
                });
            }
        });
    },
    onLoad: function(t) {},
    onShow: function() {
        this.getEmolist();
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "表情包大全"
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: t.title,
            desc: t.desc,
            path: "/pages/index/index?path=source"
        };
    }
});