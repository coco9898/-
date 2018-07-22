var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../utils/wx-promise.js")), a = require("../../components/share-guide/share-save.js"), e = getApp(), n = 750 / wx.getSystemInfoSync().windowWidth / 2;

Page({
    data: {
        getMaterialApi: e.servPreURL + "wx/worldcup",
        backgroundUrl: "https://dl.weshineapp.com/sythesis/bztbg.png",
        getContentApi: e.servPreURL + "worldcupbg",
        avatarUrl: "",
        nickName: "",
        scaleValue: 1,
        rotate: 0,
        curIndex: 0,
        tempAvatarUrl: null,
        tempHeaderUrl: null,
        saving: !1,
        degO: 180 * Math.atan(.6) / Math.PI,
        x: 265 / n / 2,
        y: 265 / n / 2 - 40 / n,
        uploadObj: {
            width: 200,
            height: 200
        },
        tempBackgroundUrl: null
    },
    onLoad: function() {
        var a = this, r = this.data;
        this.data.touch = {
            x: 185 / n / 2,
            y: 185 / n / 2 - 40 / n
        }, wx.getStorageSync("weshine::openid") || "" ? t.default.getUserInfo().then(function(t) {
            var e = t.userInfo, n = e.avatarUrl, r = e.nickName;
            a.setData({
                avatarUrl: n.slice(0, -3) + "0",
                nickName: r
            });
        }).then(function() {
            a.getTempUrl(r.avatarUrl, "tempAvatarUrl"), a.getTempUrl(r.backgroundUrl, "tempBackgroundUrl");
        }) : this.checkUserAuth(), this.getMaterial(), e.aldstat.sendEvent("世界杯头像 - 进入页面");
    },
    onShow: function() {
        this.data.ctx = wx.createCanvasContext("avatarCanvas"), this.data.avatarCtx = wx.createCanvasContext("smallAvatarCanvas");
        var t = e.trimedImg;
        t && !this.first && (this.setData({
            avatarUrl: t,
            tempAvatarUrl: t
        }), e.trimedImg = ""), this.first = !1;
    },
    onShareAppMessage: function() {
        return e.aldstat.sendEvent("世界杯头像 - 分享给队友"), {
            title: "戴上爆炸头，球队会夺冠！",
            imageUrl: "https://dl.weshineapp.com/gif/20180614/1528964659_5b22263393679.jpeg",
            path: "/pages/index/index?path=avatar-factory"
        };
    },
    getMaterial: function() {
        var t = this, a = {
            openid: this.data.openid
        };
        e.fetchWeshineData({
            url: this.data.getMaterialApi,
            requestData: a,
            method: "post"
        }, function(a) {
            a.meta && 200 === a.meta.status && (a.data.forEach(function(t) {
                t.pic = a.domain + t.pic;
            }), t.setData({
                materialList: a.data
            }));
        });
    },
    checkUserAuth: function() {
        var t = this;
        if (e.startLogin) t.checkLogin(); else var a = setInterval(function() {
            e.startLogin && (clearInterval(a), t.checkLogin());
        }, 600);
    },
    checkLogin: function() {
        var a = this, n = this, r = this.data;
        e.startLogin().then(function(e) {
            if (e && e.loginAuth) {
                var i = e.openid;
                n.setData({
                    openid: i,
                    avatarUrl: e.userinfo.userInfo.avatarUrl.slice(0, -3) + "0"
                }), a.getTempUrl(r.avatarUrl, "tempAvatarUrl"), a.getTempUrl(r.backgroundUrl, "tempBackgroundUrl");
            } else wx.showModal({
                title: "",
                content: "此功能需要授权后才可使用",
                confirmText: "前往授权",
                cancelText: "取消",
                success: function(a) {
                    a.confirm && wx.openSetting({
                        success: function(a) {
                            var e = this;
                            a.authSetting["scope.userInfo"] && t.default.getUserInfo().then(function(t) {
                                var a = t.openid, n = t.userInfo, r = n.avatarUrl, i = n.nickName;
                                e.setData({
                                    avatarUrl: r.slice(0, -3) + "0",
                                    nickName: i,
                                    openid: a
                                });
                            }).then(function() {
                                e.getTempUrl(r.avatarUrl, "tempAvatarUrl"), e.getTempUrl(r.backgroundUrl, "tempBackgroundUrl");
                            });
                        }
                    });
                }
            });
        });
    },
    getUserInfo: function(t) {
        this.data;
        var a = this;
        t.detail.userInfo && e.startLogin().then(function(t) {
            if (t.loginAuth) {
                var e = t.userinfo.userInfo.avatarUrl.slice(0, -3) + "0";
                a.setData({
                    avatarUrl: e
                }), a.tapSavePhoto();
            }
        });
    },
    getTempUrl: function(a, e) {
        var n = this.data;
        return n[e] ? Promise.resolve(n[e]) : t.default.getImageInfo(a).then(function(t) {
            return n[e] = t.path, t.path;
        });
    },
    fetchContentAndQRUrl: function() {
        var t = this.data, a = {
            openid: wx.getStorageSync("weshine::openid") || "",
            country: t.materialList[t.curIndex].name
        };
        return e.fetchWeshineData({
            url: this.data.getContentApi,
            requestData: a,
            method: "POST"
        });
    },
    moveMaterical: function(t) {
        var a = t.detail, e = a.x, r = a.y;
        this.data.touch = {
            x: e - 40 / n,
            y: r - 40 / n
        };
    },
    scareMaterical: function(t) {
        var a = this.data, e = t.detail.scale, r = 100 * (e - a.scaleValue) / n / 2, i = 60 * (e - a.scaleValue) / n / 2;
        a.scaleValue = e;
        var o = a.touch.x - r, s = a.touch.y - i;
        a.touch = {
            x: o,
            y: s
        };
    },
    changeMaterial: function(t) {
        this.data.tempHeaderUrl = null, this.setData({
            curIndex: t.currentTarget.dataset.index
        });
    },
    countDeg: function(t, a, e, n) {
        var r = e - t, i = n - a, o = Math.abs(i / r), s = Math.atan(o) / (2 * Math.PI) * 360;
        return r < 0 && i < 0 ? s = 180 - s : r <= 0 && i >= 0 ? s += 180 : r > 0 && i > 0 && (s = 90 - s + 270), 
        s;
    },
    moveRotate: function(t) {
        var a = t.touches[0], e = this.data, r = (wx.getSystemInfoSync().windowWidth - 285 / n) / 2, i = a.clientX - r, o = a.clientY, s = {
            x: e.touch.x + 100 * e.scaleValue / n / 2,
            y: e.touch.y + 60 * e.scaleValue / n / 2
        };
        this.setData({
            rotate: -(this.data.degO + this.countDeg(s.x, s.y, i, o)) % 360
        });
    },
    tapSavePhoto: function() {
        var r = this, i = this.data;
        if (!i.saving) {
            var o = i.scaleValue, s = i.touch, c = i.ctx, l = i.avatarCtx;
            c.setFillStyle("white"), c.fillRect(0, 0, 1125 / n, 1574 / n), i.saving = !0, wx.showLoading({
                title: "保存中",
                mask: !0
            }), e.aldstat.sendEvent("世界杯头像 - 保存头像", {
                f: e.fromWhere
            }), this.getTempUrl(i.backgroundUrl, "tempBackgroundUrl").then(function(t) {
                c.drawImage(t, 0, 0, 1125 / n, 1574 / n);
            }).then(function() {
                return r.getTempUrl(i.avatarUrl, "tempAvatarUrl");
            }).then(function(t) {
                return c.drawImage(t, 330 / n, 588 / n, 466 / n, 466 / n), l.drawImage(t, 0, 0, 285 / n, 285 / n), 
                r.fetchContentAndQRUrl();
            }).then(function(t) {
                var a = t.data;
                c.font = "normal bold " + 60 / n + "px sans-serif", c.setFillStyle("white"), c.setTextAlign("center");
                var e = 562.5 / n;
                return c.fillText("我是" + a.country + "的第" + a.num + "位球迷", e, 1160 / n), c.fillText("有我在，" + a.celebrity + "不慌！", e, 1264 / n), 
                r.getTempUrl(i.materialList[i.curIndex].pic, "tempHeaderUrl");
            }).then(function(t) {
                var a = 100 * o / n, e = 100 * o / n, r = 466 / 285;
                c.save(), c.translate(330 / n + (s.x + a / 2) * r, 588 / n + (s.y + .6 * e / 2) * r), 
                c.rotate(i.rotate * Math.PI / 180), c.drawImage(t, (0 - a / 2) * r, (0 - .6 * e / 2) * r, a * r, e * r), 
                c.restore(), l.save(), l.translate(s.x + a / 2, s.y + .6 * e / 2), l.rotate(i.rotate * Math.PI / 180), 
                l.drawImage(t, 0 - a / 2, 0 - .6 * e / 2, a, e), l.restore();
            }).then(function() {
                return new Promise(function(e, n) {
                    c.draw(!1, function() {
                        t.default.canvasToTempFilePath({
                            canvasId: "avatarCanvas",
                            quality: 1,
                            fileType: "jpg"
                        }).then(function(t) {
                            (0, a.andriodSave)(t.tempFilePath).then(function(t) {
                                t.success ? e(t) : n(t);
                            }).catch(function() {
                                n();
                            });
                        });
                    });
                });
            }).then(function() {
                return new Promise(function(e, n) {
                    l.draw(!1, function() {
                        t.default.canvasToTempFilePath({
                            canvasId: "smallAvatarCanvas",
                            quality: 1,
                            fileType: "jpg"
                        }).then(function(t) {
                            (0, a.andriodSave)(t.tempFilePath).then(function(t) {
                                t.success ? e(t) : n(t);
                            }).catch(function() {
                                n();
                            });
                        });
                    });
                });
            }).then(function(t) {
                i.saving = !1, wx.hideLoading(), wx.showToast({
                    title: "保存成功"
                });
            }).catch(function(t) {
                i.saving = !1, t && "去开启权限" === t.msg ? wx.hideLoading() : (wx.hideLoading(), wx.showModal({
                    title: "",
                    content: "保存失败，请重试",
                    cancelText: "知道了",
                    showCancel: !1
                }));
            });
        }
    }
});