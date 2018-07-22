var e = require("../../../components/share-guide/share-save"), t = getApp();

Page({
    onShareAppMessage: function(e) {
        t.aldstat.sendEvent("通用合成 - 结果页 - 分享卡片", {
            id: this.data.id
        });
        var a = "/pages/universal-make/share/share?from=share&img=" + this.data.image + "&guideTip=" + this.data.guideTip + "&title=" + this.data.title + "&shareText=" + this.data.shareText + "&shareImg=" + this.data.shareImg + "&id=" + this.data.id;
        return {
            imageUrl: this.data.image + "!w5h4",
            path: "/pages/index/index?go=" + encodeURIComponent(a),
            title: this.data.shareText,
            success: function() {}
        };
    },
    data: {
        image: "",
        bgMusic: "",
        guideTip: "",
        title: "",
        shareText: "",
        shareImg: "",
        qrcodeImg: "",
        id: ""
    },
    onLoad: function(e) {
        var t = e.img, a = e.guideTip, i = e.title, s = e.shareText, n = e.shareImg, o = e.id, d = e.qrcodeImg;
        this.setData({
            image: decodeURIComponent(t) || "",
            guideTip: a,
            title: i,
            shareText: s,
            shareImg: n,
            qrcodeImg: decodeURIComponent(d) || "",
            id: o + ""
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
    toDownload: function() {
        try {
            this.selectComponent("#share-component").save(), this.data.qrcodeImg && this.selectComponent("#qrcode-component").save();
        } catch (t) {
            (0, e.wxShare)(this.data.image);
        }
        t.aldstat.sendEvent("通用合成 - 结果页 - 保存图片", {
            id: this.data.id
        });
    },
    shareTap: function() {},
    previewImage: function() {
        try {
            this.selectComponent("#share-component").share();
        } catch (t) {
            (0, e.wxShare)(this.data.image);
        }
    }
});