var e = require("../../../utils/querystring"), t = getApp();

Page({
    data: {
        shareMessageAPI: t.servPreURL + "wx/faceshare",
        content: "",
        showGif: "",
        bgMusic: "",
        targetKey: "",
        openid: "",
        mid: "",
        shareTitle: "我定制了一张鬼畜音乐动图表情，不好笑算我输",
        shareImage: ""
    },
    pingPlay: function() {
        t.pingback("cface_madebtnclick.gif");
    },
    previewGif: function() {
        var e = this;
        wx.previewImage({
            urls: [ e.data.showGif ]
        });
    },
    getShareMessage: function() {
        var e = this, a = {
            url: e.data.showGif
        };
        t.fetchWeshineData({
            method: "POST",
            url: e.data.shareMessageAPI,
            requestData: a
        }, function(t) {
            if (t.meta.status && "200" == t.meta.status) {
                var a = t.data;
                e.setData({
                    shareTitle: a.share_title,
                    shareImage: a.url
                });
            }
        });
    },
    onLoad: function(e) {
        var a = e.showGif, i = e.ct_id, s = e.id, n = e.bgm, o = i + "_" + s, a = decodeURIComponent(a), n = decodeURIComponent(n);
        this.setData({
            ct_id: i,
            id: s,
            showGif: a,
            bgm: n,
            mid: o
        }), this.getShareMessage();
        var r = {
            mid: o
        };
        t.pingback("cface_viewsharepic.gif", r);
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "表情秀秀"
        });
    },
    onShow: function() {
        this.selectComponent("#music-component").onShow();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide();
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        var t = this, a = t.data, i = {
            showGif: a.showGif,
            bgm: a.bgm,
            ct_id: a.ct_id,
            id: a.id
        }, s = "/pages/change-face/custom-made-show/custom-made-show" + (0, e.stringify)(i, "?");
        return {
            title: t.data.shareTitle,
            imageUrl: t.data.shareImage,
            path: "/pages/index/index?go=" + encodeURIComponent(s)
        };
    }
});