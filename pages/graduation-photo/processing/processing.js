function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

function e(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var a = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a = arguments[e];
        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
    }
    return t;
}, n = require("../../../utils/util.js"), i = require("../../../utils/request.js"), o = t(require("../../../utils/wx-promise.js")), s = t(require("../../../utils/querystring.js")), r = [], h = [ 9, 20, 30, 35, 40 ], c = [ 1.2, 1, .95, .8, .7 ], d = 0, u = getApp(), l = null, f = null, p = null;

Page({
    data: {
        positionArr: [],
        openid: "",
        nickname: "",
        photo_id: "",
        showInfoIndex: -1,
        photoInfoAPI: u.servPreURL + "groupphoto/getgraduationinfo",
        changeSeatAPI: u.servPreURL + "groupphoto/checkin",
        updateCover: u.servPreURL + "groupphoto/updatecover",
        qrInfo: u.servPreURL + "groupphoto/getcode",
        checkChange: u.servPreURL + "groupphoto/ischange",
        shareTextAPI: u.servPreURL + "groupphoto/sharetext",
        posterPath: "https://dl.weshineapp.com/gif/20180606/1528278650_5b17ae7a7e558.png",
        clickIndex: -1,
        w1: 35,
        w: 59,
        h: 88.5,
        lack_num: 0,
        selfIndex: -1,
        music_url: "",
        compound_url: "",
        seatArr: [],
        tempFile: {
            background: {},
            text: [],
            qrCode: "/resources/img/qrCode.jpg",
            posterBackground: null,
            posterQrImage: null
        },
        base: 750 / wx.getSystemInfoSync().windowWidth / 2,
        saving: !1,
        uploading: !1,
        stepName: !1,
        is_guide: !1,
        shareAir: !1,
        canvasItemMap: null,
        canvasReady: !1,
        shareText: ""
    },
    onLoad: function(t) {
        var e = this;
        if (this.data.canvasItemMap = new Map(), t.scene) {
            var a = s.default.parse(decodeURIComponent(t.scene));
            this.data.photo_id = a.photo_id, t.refer = "moments";
        } else this.data.photo_id = t.photo_id;
        u.pingback("photo_seats.gif", {
            refer: t.refer || "",
            f: u.fromWhere
        }), this.getInformation().then(function() {
            e.getShareText();
        }), f = wx.createCanvasContext("graduationPhoto"), l = wx.createCanvasContext("thumbnailPhoto"), 
        p = wx.createCanvasContext("posterPhoto"), u.aldstat.sendEvent("毕业照 - 站位页 - 进入页面", {
            f: u.fromWhere
        });
    },
    onShow: function() {
        this.data;
        this.data.selfIndex > -1 && (this.setShowModal(), this.prepareDraw("upload")), this.selectComponent("#music-component").onShow();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide();
    },
    getInformation: function() {
        var t = this, e = wx.getStorageSync("weshine::openid") || "";
        return new Promise(function(a, n) {
            e ? (t.setData({
                openid: e
            }), a()) : t.getStartLogin().then(function() {
                a(t.startLogin());
            });
        }).then(function() {
            return wx.showLoading(), t.initInformation();
        }).then(function() {
            wx.hideLoading(), t.setPageParams();
        }).catch(function(t) {
            wx.hideLoading(), "apiFail" === t.type && wx.showToast({
                icon: "none",
                title: "加载失败，请重试"
            });
        });
    },
    getStartLogin: function() {
        return new Promise(function(t, e) {
            if (u.startLogin) t(); else var a = setInterval(function() {
                u.startLogin && (clearInterval(a), t());
            }, 600);
        });
    },
    setPageParams: function() {
        var t = this;
        this.setParams(), this.setShowModal(), this.setPhotoBackground(), this.setQrImage(), 
        this.setPosterPath(), this.initCanvasMaterial().catch(function() {
            t.data.canvasReady = !1;
        });
    },
    setQrImage: function() {
        var t = this, e = this.data, a = {
            openid: e.openid,
            page: this.route,
            photo_id: e.photo_id,
            scene: "photo_id=" + e.photo_id
        };
        u.fetchWeshineData({
            method: "POST",
            url: e.qrInfo,
            requestData: a
        }, function(e) {
            e.meta && 200 === e.meta.status && e.data ? t.setQrImagePath(e.data) : t.setQrImage();
        }, this.setQrImage);
    },
    setQrImagePath: function(t) {
        var e = this.data;
        return e.tempFile.posterQrImage ? Promise.resolve() : o.default.getImageInfo(t).then(function(t) {
            return e.tempFile.posterQrImage = t.path, Promise.resolve();
        }, function() {
            return Promise.reject();
        });
    },
    setPosterPath: function() {
        var t = this.data;
        return new Promise(function(e, a) {
            if (!t.tempFile.posterBackground) return o.default.getImageInfo(t.posterPath).then(function(e) {
                t.tempFile.posterBackground = e.path;
            }, a);
            e();
        });
    },
    setPhotoBackground: function() {
        var t = this.data, e = t.base;
        return new Promise(function(a, n) {
            t.tempFile.background.path ? a() : o.default.getImageInfo(t.compound_url).then(function(n) {
                t.tempFile.background = {
                    path: n.path,
                    x: 0,
                    y: 0,
                    w: 1050 / e,
                    h: 700 / e
                }, a();
            }, n);
        });
    },
    startLogin: function() {
        var t = this;
        return new Promise(function(e, a) {
            u.startLogin().then(function(n) {
                if (n && n.loginAuth) {
                    var i = n.openid, s = n.userinfo.userInfo.nickName || "我";
                    t.setData({
                        openid: i,
                        nickname: s
                    }), e();
                } else o.default.showModal({
                    title: "",
                    content: "此功能需要授权后才可使用",
                    confirmText: "前往授权",
                    cancelText: "取消"
                }).then(function(t) {
                    t.confirm ? wx.openSetting({
                        success: function(t) {
                            t.authSetting["scope.userInfo"] ? e() : a();
                        }
                    }) : a();
                }, a);
            }, a);
        });
    },
    initInformation: function(t) {
        var e = this, a = this.data, n = {
            openid: a.openid,
            photo_id: a.photo_id
        };
        return new Promise(function(t, i) {
            u.fetchWeshineData({
                method: "POST",
                url: a.photoInfoAPI,
                requestData: n
            }, function(n) {
                if (n.meta && 200 === n.meta.status) {
                    var o = n.data, s = o.lack_num, r = o.music_url, h = o.seatArr, c = o.compound_url, d = o.is_guide;
                    e.setData({
                        lack_num: s,
                        music_url: r,
                        seatArr: h,
                        compound_url: c,
                        is_guide: d
                    });
                    var u = -1;
                    a.seatArr.some(function(t, e) {
                        return t.uid === a.openid && (u = e), t.uid === a.openid;
                    }), e.setData({
                        selfIndex: u,
                        nickname: a.seatArr[u] && a.seatArr[u].nickname || "我"
                    }), t(n.data);
                } else i({
                    type: "apiFail",
                    message: "getGraduationInfoFail"
                });
            });
        });
    },
    setParams: function() {
        var t = this;
        r = [ {
            cx: 188,
            cy: 145
        } ];
        var e = this.data.seatArr.length, a = -1;
        this.data.seatArr.some(function(e, n) {
            return e.uid === t.data.openid && (a = n), e.uid === t.data.openid;
        });
        var n = this.data, i = n.w1, o = n.w, s = n.h, d = c[1];
        if (d = e < h[0] ? c[0] : e < h[1] ? c[1] : e < h[2] ? c[2] : e < h[3] ? c[3] : c[4], 
        this.setData({
            selfIndex: a,
            w1: i * d,
            w: o * d,
            h: s * d
        }), e > 8 && e <= 17) {
            var u = Math.floor(e / 2);
            r.unshift({
                cx: r[0].cx,
                cy: r[0].cy - 32
            }), this.initPosition(0, u + 1, 0), this.initPosition(1, e - u - 1, u + 1);
        } else if (e > 17) {
            var l = Math.floor(e / 3);
            r.push({
                cx: r[0].cx,
                cy: r[0].cy + 32
            }), r.unshift({
                cx: r[0].cx,
                cy: r[0].cy - 32
            }), l === e - 2 * l - 1 ? (this.initPosition(0, l, 0), this.initPosition(1, l + 1, l), 
            this.initPosition(2, l, 2 * l + 1)) : (this.initPosition(0, l + 1, 0), this.initPosition(1, l, l + 1), 
            this.initPosition(2, e - 2 * l - 1, 2 * l + 1));
        } else this.initPosition(0, e, 0);
        -1 === this.data.selfIndex && this.setRandomPosition();
    },
    getUserInfo: function(t) {
        t.detail.userInfo && this.getInformation();
    },
    initPosition: function(t, a, n) {
        var i = Math.ceil(a / 2), o = r[t], s = this.data, h = o.cy - s.h / 2;
        d = (s.w - s.w1) / 2;
        for (var c = 0; c < a; c++) {
            var u = o.cx + s.w1 / 2 - s.w1 * (i - c) - d;
            a % 2 == 0 && (u = o.cx - s.w1 * (i - c) - d);
            var l = "positionArr[" + (c + n) + "]";
            this.setData(e({}, l, {
                x: u,
                y: h
            }));
        }
    },
    tapSaveButton: function() {
        var t = this;
        wx.showActionSheet({
            itemList: [ "还剩 " + t.data.lack_num + " 个空位", "👫 生成邀请海报 👭", "保存合照到手机" ],
            success: function(e) {
                var a = e.tapIndex;
                switch (a) {
                  case 0:
                    t.goMemberDetail("poster");
                    break;

                  case 1:
                    t.checkSaveToAlbumAuth().then(function(e) {
                        wx.showLoading({
                            title: "图片保存中"
                        }), t.data.saving = !0, t.startDrawCanvas("poster");
                    });
                    break;

                  case 2:
                    t.checkSaveToAlbumAuth().then(function(e) {
                        if (t.data.lack_num) return t.confirmSavePhoto();
                    }).then(function(e) {
                        wx.showLoading({
                            title: "图片保存中"
                        }), u.aldstat.sendEvent("毕业照 - 站位页 - 保存图片", {
                            f: u.fromWhere
                        }), t.data.saving = !0, t.startDrawCanvas("save");
                    });
                }
                u.aldstat.sendEvent("毕业照 - 站位页 - 点击保存按钮 - " + [ "查看现有名单", "保存朋友圈邀请海报", "保存合照到手机" ][a], {
                    f: u.fromWhere
                });
            }
        });
    },
    checkSaveToAlbumAuth: function() {
        if (this.data.saving) return new Promise.reject();
        return new Promise(function(t, e) {
            o.default.getSetting().then(function(a) {
                a.authSetting["scope.writePhotosAlbum"] ? t() : !1 === a.authSetting["scope.writePhotosAlbum"] ? o.default.showModal({
                    title: "授权通知",
                    content: "为了保存到相册，您需要开启您的保存到相册权限",
                    confirmText: "现在开启",
                    cancelText: "不用了"
                }).then(function(a) {
                    a.confirm ? wx.openSetting({
                        success: function(a) {
                            a.authSetting["scope.writePhotosAlbum"] ? t() : e();
                        },
                        fail: function() {
                            e();
                        }
                    }) : o.default.authorize("scope.writePhotosAlbum").then(t, e);
                }, reje) : o.default.authorize("scope.writePhotosAlbum").then(t, e);
            }, e);
        });
    },
    setRandomPosition: function() {
        if (this.data.lack_num) {
            var t = JSON.parse(JSON.stringify(this.data.positionArr)), e = this.data.seatArr;
            t.forEach(function(t, a) {
                e[a].uid && (t.hasP = !0);
            });
            var a = this.splitPosArr(t), n = a.length - 1;
            this.choosePosition(a, 1, n, 0, -1);
        }
    },
    splitPosArr: function(t) {
        for (var e = []; t.length; ) {
            var a = t.filter(function(e) {
                return t[0].y === e.y;
            });
            e.push(a), t = t.slice(a.length);
        }
        return e;
    },
    choosePosition: function(t, e, a, n, i) {
        function o() {
            e < s && n <= s - 1 ? (e++, u.choosePosition(t, e, a, n, -1)) : a > 0 && (e = 1, 
            a--, u.choosePosition(t, e, a, n, -1));
        }
        var s = t[a].length;
        n = Math.floor(s / 2);
        var r = Math.ceil(e / 2 - .5) * Math.pow(i, e);
        1 !== e && (n += r), (n >= s || n < 0) && (n = n - r + -1 * r);
        var h = t[a][n], c = h.x, d = h.y, u = this;
        if (!h.hasP) return this.selectPerson({}, c + 20, d + 20).then(function(t) {
            t || o();
        });
        o();
    },
    selectPerson: function(t, e, a) {
        var n = this, i = this.data, o = e || t.detail.x * i.base, s = a || t.detail.y * i.base, r = this, h = JSON.parse(JSON.stringify(i.positionArr));
        return h.reverse(), this.setData({
            showInfoIndex: -1
        }), new Promise(function(t, e) {
            h.some(function(e, a) {
                var c = !1;
                if (e.x + d < o && e.x + i.w1 + d > o && e.y < s && e.y + i.h > s) {
                    c = !0;
                    var u = h.length - a - 1;
                    if (i.selfIndex === u) return !0;
                    i.seatArr[u].figure_url ? i.selfIndex < 0 ? (i.lack_num ? wx.showModal({
                        title: "",
                        content: "该位子已被抢，看看别的位子吧",
                        confirmText: "去重选",
                        showCancel: !1
                    }) : n.setData({
                        showInfoIndex: u
                    }), r.setData({
                        clickIndex: -1
                    }), t(!1)) : (n.setData({
                        clickIndex: -1,
                        showInfoIndex: u
                    }), n.setSeat().then(function(e) {
                        t(e);
                    })) : (r.setData({
                        clickIndex: u
                    }), i.selfIndex > -1 ? wx.showModal({
                        title: "确认换位",
                        content: "确定换到该位置吗？",
                        success: function(e) {
                            e.confirm ? (r.setData({
                                selfIndex: u
                            }), r.setSeat(i.selfIndex).then(function(e) {
                                t(e);
                            })) : (r.setData({
                                clickIndex: -1
                            }), t(!1));
                        }
                    }) : (n.setData({
                        selfIndex: u,
                        clickIndex: -1
                    }), r.setSeat().then(function(e) {
                        t(e);
                    })));
                }
                return c;
            });
        });
    },
    doDrawQrPoster: function(t) {
        var e = this, n = this.data, i = n.base, s = p;
        return new Promise(function(r, h) {
            Promise.all([ e.setQrImagePath(), e.setPosterPath() ]).then(function(e) {
                s.setFillStyle("white"), s.fillRect(0, 0, 750 / i, 1046 / i), s.drawImage(n.tempFile.posterBackground, 0, 0, 750 / i, 1046 / i), 
                s.drawImage(t, 88 / i, 298 / i, 576 / i, 384 / i);
                var c = 750 / i, d = 766 / i;
                s.drawImage(n.tempFile.posterQrImage, c - 186 / i - 60 / i, d, 186 / i, 186 / i);
                var u = {
                    canvasId: "posterPhoto",
                    quality: 1,
                    fileType: "jpg"
                };
                s.draw(!1, function() {
                    o.default.canvasToTempFilePath(a({}, u)).then(function(t) {
                        var e = t.tempFilePath;
                        r(o.default.saveImage({
                            filePath: e
                        }));
                    }, h);
                });
            }, h);
        });
    },
    confirmSavePhoto: function() {
        var t = this;
        return new Promise(function(e, a) {
            o.default.showModal({
                title: "确认保存",
                content: "当前还有 " + t.data.lack_num + " 位同学/老师没有入座，确认保存吗？",
                confirmText: "邀请入座",
                cancelText: "确认保存"
            }).then(function(t) {
                t.cancel ? e() : a();
            }, a);
        });
    },
    prepareDraw: function(t) {
        var e = this, a = this.data;
        this.checkChange().then(function(n) {
            if (n.data) {
                "doUpload" === t && (u.aldstat.sendEvent("毕业照 - 站位页 - 更新缩略图", {
                    f: u.fromWhere
                }), e.data.uploading = !0, wx.showLoading({
                    title: "缩略图更新中"
                }));
                var i = JSON.stringify(e.data.seatArr);
                e.initInformation().then(function(n) {
                    var o = JSON.stringify(e.data.seatArr);
                    i === o ? t && (a.canvasReady ? e.startDrawCanvas(t) : e.initCanvasMaterial(t).then(function(a) {
                        e.startDrawCanvas(t);
                    }, function(e) {
                        "doUpload" === t && (wx.hideLoading(), wx.showModal({
                            title: "",
                            content: "更新失败，请重试",
                            cancelText: "知道了",
                            showCancel: !1
                        }), a.uploading = !1);
                    })) : (a.canvasReady = !1, t && e.initCanvasMaterial(t).then(function(a) {
                        e.startDrawCanvas(t);
                    }, function(e) {
                        "doUpload" === t && (wx.hideLoading(), wx.showModal({
                            title: "",
                            content: "更新失败，请重试",
                            cancelText: "知道了",
                            showCancel: !1
                        }), a.uploading = !1);
                    }));
                });
            } else "doUpload" === t && wx.showModal({
                title: "",
                content: "当前已是最新缩略图",
                confirmText: "知道了",
                showCancel: !1
            });
        });
    },
    startDrawCanvas: function(t) {
        var e = this, a = this.data, n = "save" === t || "poster" === t, i = "doUpload" === t;
        Promise.all([ this.setPhotoBackground(), this.initCanvasMaterial() ]).then(function(a) {
            e.drawCanvasContent(t);
        }).then(function(a) {
            var n = "save" === t ? f : l;
            return e.drawCanvas(n, t);
        }).then(function(t) {
            (n || i) && (wx.hideLoading(), n ? (a.saving = !1, wx.showToast({
                title: "保存成功"
            })) : a.uploading = !1);
        }).catch(function(t) {
            (n || i) && (wx.hideLoading(), n ? a.saving = !1 : a.uploading = !1, wx.showModal({
                title: "",
                content: (n ? "保存" : "更新") + "失败，请重试",
                cancelText: "知道了",
                showCancel: !1
            }));
        });
    },
    drawCanvasContent: function(t) {
        var e = this.data.base, a = "save" === t ? f : l;
        a.setFillStyle("white"), a.fillRect(0, 0, 1050 / e, 830 / e), this.drawBackground(a), 
        this.drawContentInfo(a, t);
    },
    drawBackground: function(t) {
        var e = this.data.tempFile.background;
        t.drawImage(e.path, e.x, e.y, e.w, e.h);
    },
    drawNickname: function(t) {
        var e = this.data, a = e.base, n = 1050 / a, i = 700 / a;
        t.drawImage(e.tempFile.qrCode, n - 110 / a - 10 / a, i + 10 / a, 110 / a, 110 / a);
        var o = [], s = "";
        t.setTextAlign("center"), t.setFontSize(parseInt(12 / a)), t.setFillStyle("black"), 
        i += 40 / a;
        for (var r = e.tempFile.text, h = r.length, c = 0; c < h; c++) {
            var d = r[c];
            d.v && o.push(d.v), (r[c + 1] && r[c + 1].y !== d.y || c === h - 1) && (s = o.join(" | "), 
            t.fillText(s, n / 2, i), o = [], i += 30 / a);
        }
    },
    drawCanvas: function(t, e) {
        var n = this, i = this.data.base, s = {
            canvasId: "save" === e ? "graduationPhoto" : "thumbnailPhoto",
            width: 1050 / i,
            quality: 1,
            fileType: "jpg"
        };
        return "upload" !== e && "doUpload" !== e || (s.destWidth = 600, s.destHeight = 400), 
        new Promise(function(i, r) {
            t.draw(!1, function() {
                o.default.canvasToTempFilePath(a({}, s)).then(function(t) {
                    var a = t.tempFilePath;
                    "poster" === e && i(n.doDrawQrPoster(a)), e && "upload" !== e && "doUpload" !== e ? "save" === e && i(o.default.saveImage({
                        filePath: a
                    })) : i(n.uploadPhoto(a, e));
                }, r);
            });
        });
    },
    drawContentInfo: function(t, e) {
        var a = this.data, n = 1050 / a.base / 375, i = a.canvasItemMap, o = (a.positionArr, 
        a.seatArr);
        a.positionArr.forEach(function(e, s) {
            var r = i.get(o[s].figure_url);
            r && t.drawImage(r.src, e.x * n, e.y * n, a.w * n, a.h * n);
        }), "save" === e && this.drawNickname(t);
    },
    uploadPhoto: function(t, e) {
        var a = this.data;
        wx.uploadFile({
            url: (0, i.formatUrl)(u.servPreURL + "upload"),
            filePath: t,
            name: "file",
            success: function(t) {
                var n = JSON.parse(t.data);
                if (n.meta && 200 === n.meta.status) {
                    var i = {
                        openid: a.openid,
                        photo_id: a.photo_id,
                        cover_url: n.data.upload_path
                    };
                    u.fetchWeshineData({
                        method: "POST",
                        url: a.updateCover,
                        requestData: i
                    }, function(t) {
                        t.meta && 200 === t.meta.status ? "doUpload" === e && (wx.hideLoading(), wx.showToast({
                            title: "更新成功！"
                        }), a.uploading = !1) : "doUpload" === e && (wx.hideLoading(), wx.showModal({
                            title: "",
                            content: "更新失败，请重试",
                            cancelText: "知道了",
                            showCancel: !1
                        }), a.uploading = !1);
                    });
                } else "doUpload" === e && (wx.hideLoading(), wx.showModal({
                    title: "",
                    content: "更新失败，请重试",
                    cancelText: "知道了",
                    showCancel: !1
                }), a.uploading = !1);
            }
        });
    },
    computeTextIndex: function(t) {
        for (var e = /[0-9a-z]/i, a = 0, n = 0, i = 0; i < t.length; i++) if (e.test(t[i]) ? n += .5 : n += 1, 
        n >= 5) {
            a = i + 1;
            break;
        }
        return t.slice(0, a || 5);
    },
    initCanvasMaterial: function(t) {
        var e = this, a = this.data, n = (a.base, a.seatArr), i = a.positionArr, s = n.filter(function(t) {
            return t.figure_url;
        }), r = 0, h = 0, c = 0, d = a.canvasItemMap;
        return new Promise(function(u, l) {
            a.canvasReady ? u() : (t && (a.tempFile.text = []), n.forEach(function(t, n) {
                var f = t.figure_url;
                f && (h++, d.get(f) ? ++r === s.length ? (a.canvasReady = !0, u()) : s.length === r + c && (a.canvasReady = !1, 
                l()) : o.default.getImageInfo(f).then(function(t) {
                    r++, d.set(f, {
                        src: t.path
                    }), r === s.length ? (a.canvasReady = !0, u()) : s.length === r + c && (a.canvasReady = !1, 
                    l());
                }, function(t) {
                    c++, s.length === r + c && (a.canvasReady = !1, l());
                })), a.tempFile.text[n] = {
                    y: 2 * i[n].y + 392.5,
                    v: e.computeTextIndex(t.nickname)
                };
            }));
        });
    },
    editPersonalShape: function() {
        var t = this.data.seatArr[this.data.selfIndex];
        !t && t.uid ? wx.showModal({
            title: "",
            content: "请先在站位表中选择一个位置",
            confirmText: "知道了",
            showCancel: !1
        }) : (u.aldstat.sendEvent("毕业照 - 站位页 - 修改个人形象", {
            f: u.fromWhere
        }), (0, n.navigateTo)({
            url: "/pages/graduation-photo/create-image/create-image?photo_id=" + this.data.photo_id + "&images=" + t.material_id_sets + "&seat_num=" + t.seat_num + "&nickname=" + t.nickname + "&sex=" + t.sex
        }));
    },
    setSeat: function() {
        var t = this, e = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], 
        this), a = this.data, n = a.selfIndex, i = {
            openid: a.openid,
            photo_id: a.photo_id,
            seat_num: n + 1
        }, o = JSON.stringify(a.seatArr);
        return u.fetchWeshineData({
            method: "POST",
            url: a.changeSeatAPI,
            requestData: i
        }).then(function(i) {
            if (e.setData({
                clickIndex: -1
            }), i.meta && 200 === i.meta.status) {
                var s = i.data;
                return e.initInformation().then(function(e) {
                    JSON.stringify(e) !== o && (a.canvasReady = !1, t.initCanvasMaterial());
                }), "SUCCESS_SEAT" === s.status || (-1 === n && (a.lack_num ? wx.showModal({
                    title: "",
                    content: "该位子已被抢，看看别的位子吧",
                    confirmText: "去重选",
                    showCancel: !1
                }) : t.setData({
                    showInfoIndex: selfindex
                })), !1);
            }
        });
    },
    onShareAppMessage: function() {
        u.aldstat.sendEvent("毕业照 - 站位页 - 邀请好友加入", {
            f: u.fromWhere
        }), u.pingback("photo_share.gif", {
            f: u.fromWhere
        });
        var t = this.formatShareText();
        return "processing-share" === this.data.stepName && this.setData({
            stepName: ""
        }), {
            title: t || this.data.nickname + "最大的遗憾，就是没有跟你拍过一张这样的合照",
            path: "/pages/graduation-photo/processing/processing?photo_id=" + this.data.photo_id + "&f=" + u.fromWhere + "&refer=card"
        };
    },
    goMemberDetail: function(t) {
        if (this.data.openid) {
            t || u.aldstat.sendEvent("毕业照 - 站位页 - 查看现有名单", {
                f: u.fromWhere
            });
            var e = this.data;
            (0, n.navigateTo)({
                url: "/pages/graduation-photo/members/members?photo_id=" + e.photo_id + "&nickname=" + e.nickname + "&openid=" + e.openid + "&share_image=" + encodeURIComponent(e.shareImage)
            });
        } else this.getInformation();
    },
    closeModal: function(t) {
        var e = t.detail.k;
        wx.setStorageSync(e, 2), "processing-image" === e && this.editPersonalShape(), this.setData({
            stepName: !1
        });
    },
    setShowModal: function() {
        var t = !1, e = this.data;
        e.selfIndex > -1 && !wx.getStorageSync("processing-image") ? t = "processing-image" : e.is_guide && e.lack_num && 1 === wx.getStorageSync("processing-share") && (t = "processing-share", 
        this.setData({
            shareAir: !0
        })), this.setData({
            stepName: t
        });
    },
    checkChange: function() {
        var t = this.data, e = {
            openid: t.openid,
            photo_id: t.photo_id
        };
        return u.fetchWeshineData({
            method: "POST",
            url: t.checkChange,
            requestData: e
        });
    },
    drawThumbnail: function() {
        this.data.uploading || this.prepareDraw("doUpload");
    },
    shareAirTap: function() {
        this.setData({
            shareAir: !1
        });
    },
    getShareText: function() {
        var t = this;
        u.fetchWeshineData({
            url: this.data.shareTextAPI
        }, function(e) {
            if (e.meta && 200 == e.meta.status) {
                var a = e.data.share_text;
                t.setData({
                    shareText: a
                });
            }
        });
    },
    formatShareText: function() {
        var t = /[^\{\}]+(?=\})/g, e = this.data.shareText, a = e.match(t);
        if (!a) return "";
        for (var n = a.length, i = 0; i < n; i++) {
            var o = a[i], s = this.data[o];
            if (!s) return "";
            e = e.replace("{" + o + "}", s);
        }
        return e;
    }
});