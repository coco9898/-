var t = require("../../../components/share-guide/share-save"), e = require("../../../utils/util"), a = getApp();

Page({
    onShareAppMessage: function(t) {
        a.aldstat.sendEvent("通用合成 - 分享页 - 分享卡片", {
            id: this.data.id
        });
        var e = "/pages/universal-make/share/share?from=share&img=" + this.data.image + "&guideTip=" + this.data.guideTip + "&title=" + this.data.title + "&shareText=" + this.data.shareText + "&shareImg=" + this.data.shareImg + "&id=" + this.data.id;
        return {
            imageUrl: this.data.shareImg || this.data.image,
            path: "/pages/index/index?go=" + encodeURIComponent(e),
            title: this.data.shareText
        };
    },
    data: {
        image: "",
        guideTip: "",
        bgMusic: "",
        title: "",
        id: ""
    },
    onLoad: function(t) {
        var e = t.img, a = t.guideTip, i = t.title, s = t.shareText, d = t.shareImg, n = t.id;
        this.setData({
            image: decodeURIComponent(e) || "",
            guideTip: a,
            title: i,
            shareText: s,
            shareImg: d,
            id: n + ""
        }), wx.setNavigationBarTitle({
            title: this.data.title || "DIY合成"
        });
    },
    onShow: function() {
        this.selectComponent("#music-component").onShow();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide();
    },
    goReport: function() {
        wx.navigateTo({
            url: "/pages/report/report?id=" + this.data.image
        }), a.aldstat.sendEvent("通用合成 - 分享页 - 去举报", {
            id: this.data.id,
            shareText: this.data.shareText
        });
    },
    toDownload: function() {
        try {
            this.selectComponent("#share-component").save();
        } catch (e) {
            (0, t.wxShare)(this.data.image);
        }
        a.aldstat.sendEvent("通用合成 - 分享页 - 下载图片", {
            id: this.data.id,
            shareText: this.data.shareText
        });
    },
    goDetail: function() {
        (0, e.navigateTo)({
            url: "/pages/universal-make/detail/detail?id=" + this.data.id
        }), a.aldstat.sendEvent("通用合成 - 分享页 - 去合成", {
            id: this.data.id,
            shareText: this.data.shareText
        });
    },
    previewImage: function() {
        try {
            this.selectComponent("#share-component").share();
        } catch (e) {
            (0, t.wxShare)(this.data.image);
        }
    }
});