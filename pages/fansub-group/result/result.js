var e = require("../../../components/share-guide/share-save"), t = getApp();

Page({
    onShareAppMessage: function(e) {
        return t.aldstat.sendEvent("字幕组 - 结果页 - 分享卡片", {}), {
            imageUrl: this.data.image,
            path: "/pages/fansub-group/share/share?from=share&img=" + this.data.image,
            title: "改台词，加字幕，就来恶搞字幕组~",
            success: function() {
                t.pingback("share.gif", {
                    refer: "funnysubtitle",
                    kw: "",
                    picid: ""
                });
            }
        };
    },
    data: {
        image: "",
        voices: []
    },
    onLoad: function(e) {
        this.init({
            image: decodeURIComponent(e.img) || ""
        }, function() {});
    },
    init: function(e, t) {
        var a = this;
        wx.getImageInfo({
            src: e.image,
            success: function(e) {
                a.setData({
                    image: e.path
                }), t && t();
            }
        });
    },
    startVoices: function(e) {
        e.forEach(function(e, t) {
            setTimeout(function() {
                var t = wx.createInnerAudioContext();
                t.autoplay = !0, t.src = e.audio_path, t.onEnded = function() {
                    t.destroy();
                };
            }, 10 * e.play_time);
        });
    },
    toDownload: function() {
        t.pingback("save.gif", {
            refer: "funnysubtitle",
            kw: "",
            picid: ""
        });
        try {
            this.selectComponent("#share-component").share();
        } catch (t) {
            (0, e.wxShare)(this.data.image);
        }
        t.aldstat.sendEvent("字幕组 - 结果页 - 下载图片", {});
    }
});