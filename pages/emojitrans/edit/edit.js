function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../config.js")), a = require("../../../components/share-guide/share-save.js"), n = require("../../../utils/util.js"), i = getApp();

Page({
    data: {
        inputValue: ""
    },
    onLoad: function(t) {
        this.setData({
            inputValue: t.content || ""
        }), this.type = parseInt(t.type), this.cardApi = e.default[this.type].cardApi, this.dataKey = e.default[this.type].dataKey;
    },
    setValue: function(t) {
        var e = t.detail.value;
        e = e.replace(/\n+/g, ""), this.setData({
            inputValue: e
        });
    },
    reset: function() {
        var t = this;
        wx.showModal({
            title: "重新编辑",
            content: "您的修改将不会被保存",
            success: function(e) {
                e.confirm && t.setData({
                    inputValue: ""
                });
            }
        });
    },
    copy: function() {
        this.data.inputValue ? (i.aldstat.sendEvent("翻译编辑-" + e.default[this.type].name + "-点击拷贝", {
            content: this.data.inputValue
        }), wx.setClipboardData({
            data: this.data.inputValue,
            success: function() {
                wx.showToast({
                    title: "复制成功",
                    icon: "success"
                });
            }
        })) : wx.showToast({
            title: "还未输入内容",
            icon: "none"
        });
    },
    saveResult: function() {
        var s, u = this.cardApi, o = this.dataKey, d = wx.getStorageSync("weshine::openid");
        this.data.inputValue ? (i.aldstat.sendEvent("翻译编辑-" + e.default[this.type].name + "-点击保存", {
            content: this.data.inputValue
        }), wx.showLoading(), i.fetchWeshineData({
            url: u,
            requestData: (s = {}, t(s, o, this.data.inputValue), t(s, "openid", d), s),
            method: "post"
        }).then(function(t) {
            if (!t.data) return (0, n.showErrorModel)(t.message), void wx.hideLoading();
            var e = t.data.img_url, i = "../share/share?img=" + encodeURIComponent(e);
            (0, a.andriodSave)(e).then(function(t) {
                wx.hideLoading(), wx.navigateTo({
                    url: i
                });
            }).catch(function() {
                wx.hideLoading(), wx.navigateTo({
                    url: i
                });
            });
        }).catch(function() {
            wx.hideLoading();
        })) : wx.showToast({
            title: "还未输入内容",
            icon: "none"
        });
    },
    onShareAppMessage: function() {
        return i.aldstat.sendEvent("翻译编辑-" + e.default[this.type].name + "-点击拷贝", {
            content: this.data.inputValue
        }), {
            title: e.default[this.type].name,
            path: "/pages/index/index?path=emojitrans&type=" + this.type + "&from=share",
            imageUrl: ""
        };
    }
});