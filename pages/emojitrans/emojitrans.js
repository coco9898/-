function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = require("../../components/share-guide/share-save.js"), e = require("../../utils/util.js"), n = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("./config.js")), i = getApp();

Page({
    data: {
        inputValue: "",
        inputLength: 0,
        outputValue: "",
        transTypes: n.default,
        placeholder: n.default[0].placeholder,
        navIndex: 0,
        textOverflow: !1,
        inputLengthValidate: !0,
        focus: !0
    },
    onLoad: function(t) {
        var a = parseInt(t.type) || 0;
        this.setData({
            placeholder: n.default[a].placeholder,
            navIndex: a,
            navName: n.default[a].name
        }), this.options = t;
    },
    tapNav: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.transTypes[a], n = e.placeholder, s = e.inputLengthValidate, u = e.name;
        this.setData({
            navIndex: a,
            placeholder: n,
            inputLengthValidate: s,
            inputValue: "",
            outputValue: "",
            inputLength: 0,
            navName: u,
            textOverflow: !1
        }), i.aldstat.sendEvent("翻译-功能切换", {});
    },
    setValue: function(t) {
        var a = this, e = t.detail.value, n = !1, i = (e = e.replace(/\n+/g, "")).length;
        this.data.inputLengthValidate && i > 20 && (n = !0), this.setData({
            inputValue: e,
            inputLength: i,
            textOverflow: n
        }), clearTimeout(this.timer), e ? n || (this.timer = setTimeout(function() {
            a.getTranslateResult(e);
        }, 500)) : this.setData({
            outputValue: ""
        });
    },
    getTranslateResult: function(t) {
        var a = this, n = this.data.transTypes, s = this.data.navIndex, u = n[s].api, o = n[s].dataKey, d = {
            content: t
        };
        i.fetchWeshineData({
            method: "post",
            url: u,
            requestData: d
        }).then(function(t) {
            t.data ? a.setData({
                outputValue: t.data[o]
            }) : (0, e.showErrorModel)(t.message);
        }), i.aldstat.sendEvent("翻译-" + this.data.navName + "-翻译请求", {});
    },
    resetInput: function() {
        this.setData({
            inputValue: "",
            inputLength: 0,
            textOverflow: !1,
            focus: !0,
            outputValue: ""
        });
    },
    copy: function() {
        this.data.textOverflow ? wx.showToast({
            title: "超过字数了哦！",
            icon: "none"
        }) : this.data.outputValue ? (i.aldstat.sendEvent("翻译-" + this.data.navName + "-点击拷贝", {
            content: this.data.outputValue
        }), wx.setClipboardData({
            data: this.data.outputValue,
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
    goEdit: function() {
        this.data.outputValue ? (i.aldstat.sendEvent("翻译-" + this.data.navName + "-点击编辑", {
            content: this.data.outputValue
        }), wx.navigateTo({
            url: "edit/edit?type=" + this.data.navIndex + "&content=" + this.data.outputValue
        })) : wx.showToast({
            title: "还未输入内容",
            icon: "none"
        });
    },
    saveResult: function() {
        var e, n = this, s = this.data.transTypes, u = this.data.navIndex, o = s[u].cardApi, d = s[u].dataKey, l = wx.getStorageSync("weshine::openid");
        this.data.textOverflow ? wx.showToast({
            icon: "none",
            title: "超过字数了哦！"
        }) : this.data.inputValue ? (i.aldstat.sendEvent("翻译-" + this.data.navName + "-点击保存", {
            content: this.data.outputValue
        }), wx.showLoading(), i.fetchWeshineData({
            url: o,
            requestData: (e = {}, t(e, d, this.data.outputValue), t(e, "openid", l), e),
            method: "post"
        }).then(function(t) {
            var e = t.data.img_url, i = "share/share?img=" + encodeURIComponent(e) + "&type=" + n.data.navIndex;
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
        return i.aldstat.sendEvent("翻译-" + this.data.navName + "-点击分享", {
            content: this.data.outputValue
        }), {
            title: this.data.navName,
            path: "/pages/index/index?path=emojitrans&type=" + this.data.navIndex + "&from=share",
            imageUrl: ""
        };
    }
});