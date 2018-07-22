var t = getApp();

Page({
    onShareAppMessage: function(e) {
        return t.aldstat.sendEvent("字幕组 - 合成页 - 分享卡片", {}), {
            imageUrl: this.data.image,
            path: "/pages/fansub-group/share/share?from=share&img=" + this.data.image,
            title: "改台词，加字幕，就来恶搞字幕组~"
        };
    },
    data: {
        id: "",
        image: "",
        list: []
    },
    onLoad: function(t) {
        this.data.id = t.id, this.getDetail();
    },
    getDetail: function() {
        var e = this;
        t.fetchWeshineData({
            url: t.servPreURL + "subtitle/detail",
            requestData: {
                id: this.data.id
            }
        }, function(t) {
            if (200 == t.meta.status) {
                var a = t.data;
                e.setData({
                    list: a.subtitle,
                    image: a.img_show_path
                });
            }
        });
    },
    inputWord: function(t) {
        var e = t.currentTarget.dataset.index, a = t.detail.value;
        this.data.list[e].content = a;
    },
    create: function() {
        var e = wx.getStorageSync("weshine::openid") || "";
        wx.showLoading({
            title: "生成中",
            mask: !0
        }), t.aldstat.sendEvent("字幕组 - 合成页 - 合成", {}), t.fetchWeshineData({
            url: "https://imagick.weshine.im/v2.0/subtitle/create",
            method: "POST",
            requestData: {
                openid: e,
                id: this.data.id,
                frames: JSON.stringify(this.data.list)
            }
        }, function(e) {
            if (e.meta && 200 == e.meta.status) {
                var a = e.data;
                wx.navigateTo({
                    url: "/pages/fansub-group/result/result?img=" + encodeURIComponent(a.img_url) + "&voices=" + encodeURIComponent(JSON.stringify(a.audios))
                }), t.aldstat.sendEvent("字幕组 - 合成页 - 合成成功", {});
            } else wx.showModal({
                title: "",
                content: e.message,
                showCancel: !1,
                confirmText: "知道了"
            }), t.aldstat.sendEvent("字幕组 - 合成页 - 合成失败", {});
            wx.hideLoading();
        }), t.pingback("createsubtitleitem.gif", {
            itemid: this.data.id
        });
    }
});