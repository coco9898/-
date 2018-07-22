var t = getApp(), e = !0, a = t.servPreURL + "synthesis/detail";

Page({
    onShareAppMessage: function(t) {
        var e = "/pages/universal-make/share/share?from=share&img=" + this.data.image + "&guideTip=" + this.data.guideTip + "&title=" + this.data.title + "&shareText=" + this.data.shareText + "&shareImg=" + this.data.shareImg + "&id=" + this.data.id;
        return {
            imageUrl: this.data.shareImg || this.data.image,
            path: "/pages/index/index?go=" + encodeURIComponent(e),
            title: this.data.shareText
        };
    },
    data: {
        createAPI: "",
        id: "",
        image: "",
        actionList: [],
        bgMusic: "",
        title: "闪萌表情",
        trimedImg: "",
        guideTip: "DIY更多搞笑表情",
        shareText: "",
        shareImg: ""
    },
    onLoad: function(e) {
        this.data.id = e.id || "", this.getDetail(), t.aldstat.sendEvent("通用合成 - 合成页 - 进入页面", {
            id: this.data.id + "",
            f: t.fromWhere
        });
    },
    onShow: function() {
        this.selectComponent("#music-component").onShow(), this.receiveTrimed();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide(), e = !1;
    },
    getDetail: function() {
        var e = this;
        t.fetchWeshineData({
            url: a,
            requestData: {
                id: this.data.id
            }
        }, function(t) {
            if (200 == t.meta.status) {
                var a = t.data;
                e.setData({
                    actionList: a.detail,
                    image: a.img_show_path,
                    title: a.title || "DIY合成",
                    createAPI: "https://imagick.weshine.im/v2.0/" + a.callback,
                    guideTip: a.synopsis || "DIY更多搞笑表情",
                    shareText: a.share_show_content || "",
                    shareImg: a.share_show_path || ""
                }), wx.setNavigationBarTitle({
                    title: e.data.title
                });
            }
        });
    },
    updateList: function(t) {
        var e = t.detail.index, a = t.detail.item;
        this.data.actionList[e] = a;
    },
    receiveTrimed: function() {
        if (!e) {
            var a = t.trimedImg;
            a && (this.setData({
                trimedImg: a
            }), t.trimedImg = "");
        }
    },
    checkFullness: function() {
        for (var t = this.data.actionList, e = t.length, a = !1, i = !1, s = "", n = 0; n < e; n++) {
            var r = t[n], d = !!r.content && r.content.replace(/\s+/g, "");
            if (r.hasOwnProperty("required") && 1 === r.required || !r.hasOwnProperty("required")) {
                if (!(d || 3 != r.type && 5 != r.type)) {
                    i = !0;
                    break;
                }
                if (!d) {
                    a = !0, s = r.rule ? r.rule + "不能为空" : "请完善信息";
                    break;
                }
            }
        }
        return !(!i && !a) && (wx.hideLoading(), wx.showToast({
            title: i ? "请先上传图片" : s,
            icon: "none"
        }), !0);
    },
    create: function() {
        var e = this;
        if (!e.checkFullness()) {
            var a = wx.getStorageSync("weshine::openid") || "";
            wx.showLoading({
                title: "生成中",
                mask: !0
            }), t.aldstat.sendEvent("通用合成 - 合成页 - 立刻合成", {
                id: this.data.id + "",
                f: t.fromWhere
            }), t.fetchWeshineData({
                url: this.data.createAPI,
                method: "POST",
                requestData: {
                    openid: a,
                    id: this.data.id,
                    frames: JSON.stringify(this.data.actionList)
                }
            }, function(t) {
                if (t.meta && 200 == t.meta.status) {
                    var a = t.data, i = a.qrcode_url || "", s = "/pages/universal-make/result/result?img=" + encodeURIComponent(a.img_url) + "&guideTip=" + e.data.guideTip + "&title=" + e.data.title + "&shareText=" + e.data.shareText + "&shareImg=" + e.data.shareImg + "&qrcodeImg=" + i + "&id=" + e.data.id;
                    wx.navigateTo({
                        url: s
                    });
                } else wx.showModal({
                    title: "",
                    content: t.message,
                    showCancel: !1,
                    confirmText: "知道了"
                });
                wx.hideLoading();
            });
        }
    }
});