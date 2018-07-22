var t = getApp(), e = require("../../utils/md5.js");

Page({
    data: {
        reportAPI: t.servPreURL + "wx/feedback",
        reportListAPI: t.servPreURL + "wx/feedbacklist",
        openid: "weshine@2016",
        secret: "Y2MyZTlmYmUxMWY5MjJkODE1ODE4NzgzNDNmZWI3NDM=",
        items: [],
        inputValue: "",
        id: "",
        type: "",
        lastType: "",
        isOther: !1,
        textareaShow: !0,
        maskShow: !1
    },
    getReportList: function() {
        var t = this, a = Math.round(new Date().getTime() / 1e3), i = e.md5(this.data.openid + "#" + this.data.secret + "#" + a);
        wx.request({
            url: t.data.reportListAPI + "?timestamp=" + a + "&sign=" + i,
            data: {},
            method: "GET",
            success: function(e) {
                var a = [], i = e.data;
                for (var s in i) {
                    var n = {
                        name: s,
                        value: i[s]
                    };
                    a.push(n);
                }
                a[0].checked = !0, t.setData({
                    type: a[0].name
                }), t.setData({
                    items: a
                });
                var r = a[a.length - 1].name;
                t.setData({
                    lastType: r
                });
            }
        });
    },
    radioChange: function(t) {
        var e = t.detail.value;
        this.setData({
            type: e
        }), e == this.data.lastType ? this.setData({
            isOther: !0
        }) : !this.data.isOther || this.setData({
            isOther: !1
        });
    },
    inputText: function(t) {
        var e = t.detail.value.trim();
        this.setData({
            inputValue: e
        });
    },
    confirm: function() {
        var e = this, a = wx.getStorageSync("weshine::openid"), i = {
            type: e.data.type || "",
            content: e.data.inputValue || "",
            target: e.data.id,
            openid: a,
            site: 2
        };
        t.fetchWeshineData({
            method: "POST",
            url: e.data.reportAPI,
            requestData: i
        }, function(t) {
            t.meta.status && "200" == t.meta.status && e.setData({
                textareaShow: !1,
                maskShow: !0
            });
        });
    },
    goback: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onLoad: function(t) {
        this.setData({
            id: t.id
        }), this.getReportList();
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "内容举报"
        });
    }
});