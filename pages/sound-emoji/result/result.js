require("../../../utils/util.js");

var e = getApp();

Page({
    data: {
        videoId: "myvideo",
        image: null,
        video: null,
        sourceVideo: null,
        isVoice: 0,
        audioContext: null,
        id: null,
        duration: 0,
        user: {
            imageUrl: "",
            username: "Chen",
            createTime: "2018-06-04",
            content: "文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字",
            duration: 12
        }
    },
    onShareAppMessage: function(e) {
        var i = this.data;
        return {
            title: "我给你做了个配音表情，点开听听呗",
            imageUrl: i.image + "!w5h4",
            path: "/pages/sound-emoji/share/share?type=share&id=" + i.id + "&video=" + i.video + "&dur=" + i.duration + "&isVoice=" + i.isVoice
        };
    },
    onLoad: function(i) {
        var t = this;
        this.setData({
            id: i.id || ""
        }), this.getStartData(function(e) {
            t.setData({
                sourceVideo: e.video_path,
                image: e.image_path
            });
        }), this.setData({
            video: i.video || "",
            isVoice: i.isVoice || 0,
            duration: i.dur || 0
        }), e.aldstat.sendEvent("语音表情 - 录制结果页 - 进入页面");
    },
    getStartData: function(i) {
        e.fetchWeshineData({
            url: e.servPreURL + "vodetail",
            requestData: {
                id: this.data.id
            }
        }, function(e) {
            if (200 == e.meta.status) {
                var t = e.data;
                i && i(t);
            }
        });
    },
    rebuild: function() {
        var i = this.data;
        e.aldstat.sendEvent("语音表情 - 录制结果页 - 重新录制"), wx.redirectTo({
            url: "/pages/sound-emoji/record/record?id=" + i.id + "&video=" + i.video + "&dur=" + i.duration
        });
    }
});