var t = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var e = arguments[a];
        for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
    }
    return t;
}, a = require("./data.js"), e = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/wx-promise.js")), s = require("../../../utils/util.js"), n = require("../../../utils/request.js"), i = require("../../../components/share-guide/share-save.js"), o = getApp(), r = o.servPreURL + "groupphoto/getmaterial", c = o.servPreURL + "upload", h = o.servPreURL + "groupphoto/createfigure", u = o.servPreURL + "groupphoto/filtration";

Page({
    data: {
        types: a.types,
        curIndex: 0,
        srcData: a.srcData,
        curType: a.types[0].type,
        sex: 1,
        scrollTop: 0,
        nickname: "",
        canvasW: 100,
        canvasH: 150,
        xScrollWidth: 500
    },
    onLoad: function(t) {
        wx.getStorageSync("processing-share") || wx.setStorageSync("processing-share", 1), 
        this.cache = {}, this.options = t, this.shouldSave = 1;
        var a = this.data.sex;
        this.options.sex && (a = parseInt(this.options.sex)), this.setData({
            sex: a,
            nickname: t.nickname || this.data.nickname
        }), this.getListData(a), o.aldstat.sendEvent("毕业照 - 修改形象 - 进入页面", {});
    },
    setNickname: function(t) {
        var a = t.detail.value;
        this.setData({
            nickname: a
        });
    },
    initImage: function(t) {
        if (!this.options.images) return t;
        "string" == typeof this.options.images && (this.options.images = JSON.parse(this.options.images));
        var a = this.options.images;
        return Object.keys(t).forEach(function(e) {
            t[e].current = t[e].list.findIndex(function(t) {
                return t.id === a[e];
            });
        }), t;
    },
    getListData: function(t) {
        var a = this, e = wx.getStorageSync("weshine::openid"), s = this.data.srcData;
        if (!e) throw new Error("没有openid");
        if (this.cache[t]) return this.cache[t] = this.initImage(this.cache[t]), void this.setData({
            srcData: this.cache[t]
        });
        var n = {
            openid: e,
            sex: t
        };
        return o.fetchWeshineData({
            url: r,
            requestData: n,
            method: "post"
        }).then(function(e) {
            if (200 === e.meta.status) {
                var n = e.data;
                return Object.keys(s).forEach(function(t) {
                    s[t].list = n[t];
                }), s = a.initImage(s), a.cache[t] = s, a.setData({
                    srcData: s
                }), !0;
            }
            throw new Error("请求错误");
        }).catch(function(t) {
            console.log(t);
        });
    },
    selectType: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.types[a].type;
        this.setData({
            curIndex: a,
            scrollTop: 0,
            curType: e
        });
    },
    selectItem: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.curType, s = this.data.srcData;
        s[e].current = a, this.options.images && (this.options.images[e] = s[e].list[a].id), 
        this.setData({
            srcData: s
        });
    },
    switchGender: function() {
        var t = this.data.sex;
        t = 1 === t ? 2 : 1, this.setData({
            sex: t
        }), this.getListData(t);
    },
    checkName: function() {
        var t = {
            openid: wx.getStorageSync("weshine::openid"),
            content: this.data.nickname
        };
        return o.fetchWeshineData({
            url: u,
            method: "POST",
            requestData: t
        }).then(function(t) {
            return 90019 !== t.code || ((0, s.showErrorModel)(t.message), !1);
        });
    },
    saveImage: function() {
        o.aldstat.sendEvent("毕业照 - 修改形象 - 保存个人形象", t({
            name: this.data.nickname,
            sex: this.data.sex + ""
        }, this.options.images)), this.setData({
            canvasW: 600,
            canvasH: 600
        });
        var a = this.handleSrcData();
        return this.drawImages(a, "save");
    },
    save: function(t) {
        return wx.hideLoading(), (0, i.andriodSave)(t).then(function(t) {
            return t.success && wx.showToast({
                title: "已下载至您的相册",
                mask: !0
            }), t;
        }).catch(function() {
            wx.showToast({
                icon: "none",
                title: "下载失败，请重试",
                mask: !0
            });
        });
    },
    handleSrcData: function() {
        var t = this.data.srcData, a = [];
        for (var e in t) a.push(Object.assign({
            zIndex: t[e].zIndex
        }, t[e].list[t[e].current]));
        return a = a.sort(function(t, a) {
            return t.zIndex - a.zIndex;
        });
    },
    setCanvasWH: function(t, a) {
        this.setData({
            canvasW: t,
            canvasH: a
        });
    },
    confirm: function() {
        var a = this, e = this.handleSrcData();
        o.aldstat.sendEvent("毕业照 - 修改形象 - 确认形象", t({
            name: this.data.nickname,
            sex: this.data.sex + "",
            f: o.fromWhere
        }, this.options.images)), o.pingback("photo_diy.gif", t({}, this.options.images, {
            f: o.fromWhere
        })), this.checkName().then(function(t) {
            t && (a.shouldSave ? a.saveImage().then(function(t) {
                if (t && t.success) return a.setCanvasWH(100, 150), a.drawImages(e);
            }) : (a.setCanvasWH(100, 150), a.drawImages(e)));
        });
    },
    drawName: function(t) {
        t.setTextBaseline("bottom"), t.setFontSize(25), t.setTextAlign("right"), t.fillText(this.data.nickname, this.data.canvasW - 41, this.data.canvasH - 32);
    },
    drawImages: function(t, a) {
        var n = this, i = this.data.canvasW, o = this.data.canvasH, r = 0, c = 0, h = "save" === a ? "保存中..." : "上传中...";
        wx.showLoading({
            title: h,
            mask: !0
        });
        var u = wx.createCanvasContext("canvas");
        if ("save" === a) {
            u.drawImage("./bg.png", 0, 0, i, o);
            var d = i, l = o;
            i -= 80, o -= 120, d <= l ? i = o * (500 / 750) : o = 1.5 * i, r = d - i != 0 ? (d - i) / 2 : 0, 
            c = 24, this.drawName(u);
        }
        return console.log(i, o, r, c), (0, s.getImagesInfo)(t.map(function(t) {
            return t.material_url;
        }), function(t) {
            u.drawImage(t.path, r, c, i, o);
        }).then(function(t) {
            return new Promise(function(s, i) {
                "getImageInfo:ok" === t.errMsg && u.draw(!1, function() {
                    e.default.canvasToTempFilePath({
                        canvasId: "canvas"
                    }).then(function(t) {
                        "canvasToTempFilePath:ok" === t.errMsg && ("save" === a ? (console.log("save"), 
                        n.save(t.tempFilePath).then(function(t) {
                            s(t);
                        })) : n.uploadImage(t.tempFilePath));
                    }).catch(function(t) {
                        wx.hideLoading(), console.error("toTempFile err " + t), wx.showToast({
                            title: "合成失败",
                            icon: "none",
                            mask: !0
                        });
                    });
                });
            });
        });
    },
    uploadImage: function(t) {
        var a = this, s = (0, n.formatUrl)(c);
        return e.default.uploadFile({
            url: s,
            filePath: t,
            name: "file"
        }).then(function(t) {
            var e = JSON.parse(t.data).data.upload_path;
            a.uploadParam(e);
        }).catch(function(t) {
            wx.hideLoading(), console.error("toTempFile err " + t), wx.showToast({
                title: "上传失败",
                icon: "none",
                mask: !0
            });
        });
    },
    uploadParam: function(t) {
        var a = wx.getStorageSync("weshine::openid"), s = this.data.srcData, n = this.options.images;
        n || Object.keys(s).forEach(function(t) {
            var a = s[t].list[s[t].current];
            n[a.type] = a.id;
        });
        var i = {
            openid: a,
            nickname: this.data.nickname || this.options.nickname,
            sex: this.data.sex,
            seat_num: this.options.seat_num,
            photo_id: this.options.photo_id,
            material_ids: JSON.stringify(n),
            figure_url: t
        };
        o.fetchWeshineData({
            url: h,
            requestData: i,
            method: "post"
        }).then(function(t) {
            wx.hideLoading(), 200 === t.meta.status ? e.default.showToast({
                title: "上传成功",
                icon: "success",
                mask: !0
            }).then(function() {
                setTimeout(function() {
                    wx.navigateBack();
                }, 900);
            }) : wx.showToast({
                title: "上传数据失败",
                icon: "none",
                mask: !0
            });
        });
    },
    checkboxChange: function(t) {
        console.log(t), this.shouldSave = t.detail.value.length;
    },
    resetImage: function() {
        var t = this, a = this.data.srcData;
        Object.keys(a).forEach(function(e) {
            a[e].current = 0, t.options.images && (t.options.images[e] = a[e].list[0].id);
        }), this.setData({
            srcData: a
        });
    }
});