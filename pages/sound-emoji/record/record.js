var t = require("../../../utils/util.js"), a = getApp();

Page({
    data: {
        videoId: "myvideo",
        id: null,
        recorderManager: null,
        filepath: null,
        serverpath: null,
        videoContext: null,
        normalBtn: "https://dl.weshineapp.com/gif/20180525/1527221758_5b078dfe2a7cb.png",
        pressBtn: "https://dl.weshineapp.com/gif/20180525/1527221814_5b078e3695820.png"
    },
    onLoad: function(t) {
        this.setData({
            id: t.id || "",
            video: t.video || "",
            totalDuration: t.dur || 0
        });
    },
    onReady: function() {
        this.data.videoContext = wx.createVideoContext(this.data.videoId);
    },
    startRecord: function() {
        this.data.videoContext.play();
    },
    endRecord: function() {
        this.data.videoContext.pause(), this.data.videoContext.seek(0);
    },
    playVoice: function() {
        wx.playVoice({
            filePath: this.data.filepath
        });
    },
    startUpload: function(e) {
        var i = this;
        this.data.filepath = e.detail.filepath, wx.showLoading({
            title: "正在上传中...",
            mask: !0
        }), wx.uploadFile({
            url: "https://imagick.weshine.im/v2.0/upload",
            filePath: this.data.filepath,
            name: "file",
            formData: {},
            success: function(e) {
                var d = JSON.parse(e.data);
                d.meta && 200 == d.meta.status && (i.data.serverpath = d.data.upload_path), wx.showLoading({
                    title: "正在合成中...",
                    mask: !0
                }), a.fetchWeshineData({
                    url: "https://imagick.weshine.im/v2.0/mergevoice",
                    method: "POST",
                    requestData: {
                        audio_path: i.data.serverpath,
                        id: i.data.id
                    }
                }, function(a) {
                    if (a.meta && 200 == a.meta.status) {
                        var e = a.data;
                        (0, t.navigateTo)({
                            url: "/pages/sound-emoji/result/result?id=" + i.data.id + "&video=" + e.video_path + "&dur=" + e.duratio
                        });
                    } else wx.showModal({
                        title: "",
                        content: a.message,
                        showCancel: !1,
                        confirmText: "我知道了",
                        success: function(t) {}
                    });
                    wx.hideLoading();
                });
            }
        });
    }
});