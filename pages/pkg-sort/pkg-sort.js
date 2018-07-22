var t = getApp();

Page({
    data: {
        emolistAPI: t.servPreURL + "emolist",
        pkgsList: [],
        tip: "数据加载中...",
        aid: ""
    },
    getPkgs: function(a) {
        var e = this, i = {
            openid: wx.getStorageSync("weshine::openid") || ""
        };
        t.fetchWeshineData({
            method: "post",
            url: e.data.emolistAPI + "?aid=" + a,
            requestData: i
        }, function(t) {
            if (200 == t.meta.status) {
                var a = t.data[0].list;
                e.setData({
                    pkgsList: a,
                    tip: ""
                });
            }
        });
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: t.title || "闪萌表情"
        });
        var a = t.aid || 1;
        this.setData({
            aid: a
        });
    },
    onShow: function() {
        this.getPkgs(this.data.aid);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        var a = this;
        return {
            title: t.title,
            desc: t.desc,
            path: "/pages/pkg-sort/pkg-sort?aid=" + a.data.aid
        };
    }
});