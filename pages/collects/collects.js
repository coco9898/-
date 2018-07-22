var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        collectAPI: e.servPreURL + "wx/collectlist",
        cancelCollectAPI: e.servPreURL + "wx/collectcancel",
        collectList: [],
        collectListCache: [],
        tip: "数据加载中...",
        offset: 30,
        lastIdx: 0,
        pressUrl: "",
        openid: ""
    },
    getCollectData: function() {
        var t = this, a = wx.getStorageSync("weshine::openid"), s = {
            openid: a
        };
        e.fetchWeshineData({
            method: "POST",
            url: t.data.collectAPI,
            requestData: s
        }, function(e) {
            if (e.meta.status && "200" == e.meta.status) {
                var a = e.data, s = t.data.offset;
                t.data.collectListCache = a, t.data.lastIdx = s, t.setData({
                    collectList: t.data.collectListCache.slice(0, s),
                    tip: ""
                });
            }
        }), t.setData({
            openid: a
        });
    },
    loadMore: function() {
        this.data.lastIdx >= this.data.collectListCache.length || (this.data.lastIdx += this.data.offset, 
        this.setData({
            collectList: this.data.collectListCache.slice(0, this.data.lastIdx)
        }));
    },
    clickImage: function(e) {
        var a = e.currentTarget.dataset.pic;
        (0, t.navigateTo)({
            url: "../detail/detail?id=" + a.id + "&refer=fav"
        });
    },
    longPress: function(t) {
        var e = t.currentTarget.dataset.pic;
        this.setData({
            pressUrl: e.url
        });
    },
    cancelCollect: function(t) {
        var a = this, s = t.currentTarget.dataset.pic, c = {
            openid: a.data.openid,
            gif_id: s.id
        };
        e.fetchWeshineData({
            method: "POST",
            url: a.data.cancelCollectAPI,
            requestData: c
        }, function(t) {
            t.meta.status && "200" == t.meta.status && (wx.showToast({
                title: "取消成功"
            }), a.getCollectData());
        });
    },
    closeAir: function() {
        this.setData({
            pressUrl: ""
        });
    },
    shareImage: function(t) {
        var e = t.currentTarget.dataset.pic;
        wx.previewImage({
            urls: [ e.ori_url ]
        });
    },
    onLoad: function(t) {},
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "我的收藏"
        });
    },
    onShow: function() {
        this.getCollectData(), this.setData({
            pressUrl: ""
        });
    },
    onPullDownRefresh: function() {
        this.getCollectData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: e.title,
            desc: e.desc,
            path: "/pages/index/index?path=collects"
        };
    }
});