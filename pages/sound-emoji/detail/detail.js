var e = require("../../../utils/util.js"), t = getApp();

Page({
    data: {
        videoId: "myvideo",
        image: null,
        video: null,
        sourceVideo: null,
        isVoice: 0,
        audioContext: null,
        id: null,
        type: "start",
        duration: 0,
        favorCount: 999,
        canComment: !0,
        user: {
            imageUrl: "",
            username: "测试啦啦啦",
            createTime: "2018-06-04",
            content: "文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字",
            duration: 12
        },
        commentList: [ {
            imageUrl: "",
            username: "Chen",
            createTime: "2018-06-04",
            comment: "shehksnegnekengnekekn哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }, {
            imageUrl: "",
            username: "Chen",
            createTime: "2018-06-04",
            comment: "shehksnegnekengnekekn哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }, {
            imageUrl: "",
            username: "Chen",
            createTime: "2018-06-04",
            comment: "shehksnegnekengnekekn哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }, {
            imageUrl: "",
            username: "Chen",
            createTime: "2018-06-03",
            comment: "shehksnegnekengnekekn哈哈哈哈哈"
        } ],
        favorApi: "",
        commentApi: ""
    },
    onShareAppMessage: function(e) {
        return {
            title: "我给你做了个配音表情，点开听听呗",
            imageUrl: this.data.image + "!w5h4",
            path: "/pages/sound-emoji/detail/detail?type=share&id=" + this.data.id + "&video=" + this.data.video + "&dur=" + this.data.duration + "&isVoice=" + this.data.isVoice
        };
    },
    onLoad: function(e) {
        var a = this;
        this.setData({
            id: e.id || "",
            type: e.type || ""
        }), "start" === this.data.type ? this.getStartData(function(e) {
            a.setData({
                video: e.isVoice ? e.voice_path : e.video_path,
                isVoice: e.isVoice,
                duration: e.voice_duration || 2,
                image: e.image_path
            });
        }) : (this.getStartData(function(e) {
            a.setData({
                sourceVideo: e.video_path,
                image: e.image_path
            });
        }), this.setData({
            video: e.video || "",
            isVoice: e.isVoice || 0,
            duration: e.dur || 0
        })), t.aldstat.sendEvent("语音表情 - 详情页 - 进入页面", {
            id: this.data.id
        });
    },
    getStartData: function(e) {
        t.fetchWeshineData({
            url: t.servPreURL + "vodetail",
            requestData: {
                id: this.data.id
            }
        }, function(t) {
            if (200 == t.meta.status) {
                var a = t.data;
                e && e(a);
            }
        });
    },
    startBuild: function() {
        var a = this.data;
        t.aldstat.sendEvent("语音表情 - 详情页 - 点击录制"), (0, e.navigateTo)({
            url: "/pages/sound-emoji/record/record?id=" + a.id + "&video=" + a.video
        });
    },
    favorVoice: function() {
        var e = this.data;
        t.fetchWeshineData({
            url: t.servPreURL + e.favorApi,
            requestData: {
                id: this.data.id
            }
        }, function(e) {
            if (200 == e.meta.status) e.data;
        });
    }
});