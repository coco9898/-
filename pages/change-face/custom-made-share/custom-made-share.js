var e = require("../../../components/share-guide/share-save.js"), a = require("../../../utils/request"), t = require("../../../utils/querystring"), i = (function(e) {
    e && e.__esModule;
}(require("../../../utils/wx-promise")), getApp());

Page({
    data: {
        uploadAPI: "https://face.weshineapp.com/identify",
        createAPI: "https://face.weshineapp.com/new_face_rep",
        shareMessageAPI: i.servPreURL + "wx/faceshare",
        showGif: "",
        bgm: "",
        avatar: "",
        nickName: "",
        openid: "",
        shareTitle: "我定制了一张鬼畜音乐动图表情，不好笑算我输",
        shareImage: "",
        maskShow: !1,
        mid: "",
        replaced: !1,
        noReplaced: !0
    },
    saveImage: function() {
        i.pingback("cface_savepic.gif", {
            mid: this.data.mid
        });
        try {
            this.shareComponent.save();
        } catch (a) {
            (0, e.wxShare)(this.data.showGif);
        }
    },
    previewGif: function() {
        try {
            this.shareComponent.share();
        } catch (a) {
            (0, e.wxShare)(this.data.showGif);
        }
    },
    closeMask: function() {
        this.setData({
            maskShow: !1
        });
    },
    showMask: function() {
        var e = this;
        if (i.isAuth()) {
            var a = wx.getStorageSync("weshine::openid");
            this.setData({
                openid: a,
                maskShow: !0
            }), i.pingback("cface_facebtnclick.gif");
        } else i.startLogin().then(function(a) {
            if (a.loginAuth) {
                var t = a.openid;
                e.setData({
                    openid: t,
                    maskShow: !0
                });
            } else wx.showModal({
                title: "",
                content: "此功能需要授权后才可使用",
                confirmText: "前往授权",
                cancelText: "取消",
                success: function(e) {
                    e.confirm && wx.openSetting({});
                }
            });
        });
    },
    chooseMode: function(e) {
        this.setData({
            maskShow: !1
        });
        var a = e.currentTarget.dataset.mode;
        "camera" == a ? this.setData({
            mode: [ "camera" ]
        }) : "album" == a && this.setData({
            mode: [ "album" ]
        }), this.changeFace();
    },
    proventPro: function() {},
    changeFace: function() {
        var e = this, a = e.data.mode;
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: a,
            success: function(a) {
                var t = a.tempFilePaths[0];
                wx.showLoading({
                    title: "上传中",
                    mask: !0
                }), e.uploadFile(t);
            }
        });
    },
    uploadFile: function(e) {
        var t = this, o = t.data.mode, s = {
            uuid: t.data.openid,
            v: i.appVersion
        };
        wx.uploadFile({
            url: (0, a.formatUrl)(t.data.uploadAPI, s),
            filePath: e,
            name: "file",
            formData: {},
            success: function(e) {
                if (e.statusCode && "200" == e.statusCode) {
                    var a = e.data, s = JSON.parse(a), n = s.succ;
                    if (n) {
                        try {
                            wx.setStorageSync("ws::md5", n);
                        } catch (e) {
                            throw new Error("ws::md5 set storage error" + e);
                        }
                        t.create(n);
                        r = {
                            rlt: "success",
                            desc: "",
                            mode: o[0]
                        };
                        i.pingback("cface_photofeedback.gif", r);
                    } else {
                        if (wx.hideLoading(), wx.showToast({
                            title: "请换一张照片",
                            icon: "none"
                        }), s.error) c = s.error; else var c = a;
                        var r = {
                            rlt: "fail",
                            desc: c,
                            mode: o[0]
                        };
                        i.pingback("cface_photofeedback.gif", r);
                    }
                } else wx.hideLoading(), wx.showToast({
                    title: "请换一张照片",
                    icon: "none"
                });
            },
            fail: function() {
                wx.hideLoading(), wx.showToast({
                    title: "上传失败",
                    icon: "none"
                });
            }
        });
    },
    create: function(e) {
        var t = this;
        wx.hideLoading();
        var i = this.data, o = i.openid, s = i.ct_id, n = i.id, c = (0, a.formatUrl)(t.data.createAPI) + "&uuid=" + o + "&ct_id=" + s + "&tpl_id=" + n + "&md5=" + e;
        t.setData({
            showGif: c,
            replaced: !0,
            noReplaced: !1
        }), t.getShareMessage();
    },
    getShareMessage: function() {
        var e = this, a = (e.data.md5, {
            url: e.data.showGif
        });
        i.fetchWeshineData({
            method: "POST",
            url: e.data.shareMessageAPI,
            requestData: a
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var t = a.data, i = t.share_title, o = t.url;
                e.setData({
                    shareTitle: i,
                    shareImage: o
                });
            }
        });
    },
    onLoad: function(e) {
        var a = e.showGif, t = e.ct_id, o = e.id, s = e.bgm, n = this;
        if (i.userInfo) {
            var c = i.userInfo;
            this.setData({
                nickName: c.nickName,
                avatar: c.avatarUrl
            });
        }
        var r = t + "_" + o;
        this.setData({
            ct_id: t,
            id: o,
            mid: r,
            showGif: decodeURIComponent(a),
            bgm: decodeURIComponent(s)
        });
        var d = {
            mid: n.data.mid
        };
        i.pingback("cface_viewcreatepic.gif", d);
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "表情秀秀"
        });
        try {
            this.shareComponent = this.selectComponent("#share-component");
        } catch (e) {
            console.error("detail" + e);
        }
    },
    onShow: function() {
        this.selectComponent("#music-component").onShow();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide();
    },
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        var e = this, a = e.data, o = a.showGif, s = a.ct_id, n = a.id, c = {
            showGif: o,
            bgm: a.bgm,
            ct_id: s,
            id: n
        }, r = "/pages/change-face/custom-made-show/custom-made-show" + (0, t.stringify)(c, "?");
        return console.log("gooo:", r), i.pingback("cface_sharepic.gif", {
            mid: e.data.mid
        }), {
            title: e.data.shareTitle,
            imageUrl: e.data.shareImage,
            path: "/pages/index/index?go=" + encodeURIComponent(r)
        };
    }
});