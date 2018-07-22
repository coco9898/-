var e = require("../../../components/share-guide/share-save"), t = getApp();

Page({
    onShareAppMessage: function(e) {
        return t.aldstat.sendEvent("字幕组 - 分享页 - 分享卡片", {}), {
            imageUrl: this.data.image,
            path: "/pages/fansub-group/share/share?from=share&img=" + this.data.image,
            title: "改台词，加字幕，就来恶搞字幕组~"
        };
    },
    data: {
        image: ""
    },
    onLoad: function(e) {
        this.setData({
            image: decodeURIComponent(e.img) || ""
        });
    },
    goReport: function() {
        wx.navigateTo({
            url: "/pages/report/report"
        }), t.aldstat.sendEvent("字幕组 - 分享页 - 去举报", {});
    },
    toDownload: function() {
        try {
            this.selectComponent("#share-component").share();
        } catch (t) {
            (0, e.wxShare)(this.data.image);
        }
        t.aldstat.sendEvent("字幕组 - 分享页 - 下载图片", {});
    },
    goDetail: function() {
        wx.redirectTo({
            url: "/pages/fansub-group/list/list"
        }), t.aldstat.sendEvent("字幕组 - 分享页 - 去合成", {});
    },
    goHome: function() {
        wx.redirectTo({
            url: "/pages/index/index"
        }), t.aldstat.sendEvent("字幕组 - 分享页 - 回首页", {});
    }
});