var e = require("../../../components/share-guide/share-save"), t = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../config.js")), a = getApp();

Page({
    data: {
        imgSrc: ""
    },
    onLoad: function(e) {
        var t = decodeURIComponent(e.img);
        this.type = e.type, this.setData({
            imgSrc: t
        });
    },
    tapImage: function() {
        (0, e.wxShare)(this.data.imgSrc);
    },
    onShareAppMessage: function() {
        return a.aldstat.sendEvent("翻译-图片结果分享", {
            img: this.data.imgSrc
        }), {
            title: t.default[this.type].name,
            path: "/pages/index/index?path=emojitrans&type=" + this.type + "&from=share",
            imageUrl: ""
        };
    }
});