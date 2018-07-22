function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

function t(e) {
    return void 0 === e || null === e;
}

var a = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../utils/wx-promise")), n = require("../../utils/util"), r = require("../../utils/md5"), o = getApp(), i = o.servPreURL + "wcupforecast";

Page({
    data: {
        scoreRange: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
        list: [],
        canvasW: 500,
        canvasH: 772
    },
    onLoad: function(e) {
        this.getListData(), o.aldstat.sendEvent("比分预测 - 进入页面", {
            f: o.fromWhere
        });
    },
    getListData: function() {
        var e = this, t = {
            openid: wx.getStorageSync("weshine::openid")
        };
        o.fetchWeshineData({
            url: i,
            method: "post",
            requestData: t
        }).then(function(t) {
            t.data.forEach(function(e) {
                e.monthDay = e.monthDay = e.monthDay.replace(/(.*)-(.*)/, function(e, t, a) {
                    return parseInt(t) + "月" + parseInt(a) + "日";
                });
            }), e.setData({
                list: t.data
            });
        });
    },
    random: function(e) {
        return Math.floor(Math.random() * e);
    },
    chooseNum: function(e) {
        var a = e.currentTarget.dataset, n = a.index, r = a.item, i = e.detail.value, s = this.data.list;
        console.log(n, r, i), s[n][r] = i, this.setData({
            list: s
        });
        var c = s[n], l = c.score1, d = c.score2;
        t(l) || t(d) || o.aldstat.sendEvent("比分预测 - 修改比分", {
            f: o.fromWhere
        });
    },
    getUserInfo: function(e) {
        if ("getUserInfo:ok" === e.detail.errMsg) {
            var t = [ "子曰：三人行，必有一神算子", "长亭外，古道边，我的预测稳如仙", "少壮不预测，老大住茅厕", "空山新雨后，买定请离手", "买大米，焖干饭，猜对鸡腿手里攥", "人生在世不称意，不如多猜两场球", "雌雄双兔傍地走，今夜阁下猜球否", "商女不知亡国恨，夜夜猜球赛神棍", "垂死病中惊坐起，猜猜这局几比几", "天马流星拳，暴富在眼前", "猜的好，住城堡，猜的坏，六环外", "剑在手，跟我走，我的预测稳如狗" ], a = e.detail.userInfo, n = a.avatarUrl, r = a.nickName, i = e.currentTarget.dataset.index, s = this.data.list[i], c = s.fImg, l = s.fName, d = s.sImg, h = s.sName, g = s.hour, f = s.monthDay, p = s.score1, u = s.score2;
            if (console.log(p, u), void 0 === p || void 0 === u) return void wx.showToast({
                title: "请修改比分",
                icon: "none"
            });
            var m = this.data, x = m.canvasH, v = m.canvasW, w = wx.createCanvasContext("canvas"), y = {
                canvasW: v,
                canvasH: x,
                ctx: w,
                mList: [ {
                    type: "image",
                    x: 0,
                    y: 0,
                    w: v,
                    h: x,
                    src: "https://dl.weshineapp.com/gif/20180628/1530179580_5b34affc4b2e7.png"
                }, {
                    type: "image",
                    src: n,
                    x: 50,
                    y: 256,
                    w: 90,
                    h: 90,
                    circle: !0
                }, {
                    type: "image",
                    src: c,
                    x: 50,
                    y: 372,
                    w: 120,
                    h: 80
                }, {
                    type: "image",
                    src: d,
                    x: 330,
                    y: 372,
                    w: 120,
                    h: 80
                }, {
                    type: "image",
                    src: "https://dl.weshineapp.com/worldcup/wcupforecast2.png",
                    x: 200,
                    y: 648,
                    w: 100,
                    h: 100
                }, {
                    type: "text",
                    text: r,
                    x: 160,
                    y: 272,
                    align: "left",
                    baseline: "top",
                    bold: !0,
                    fontSize: 24,
                    maxWidth: 222
                }, {
                    type: "text",
                    text: "窥探天机预测",
                    x: 160,
                    y: 305,
                    align: "left",
                    baseline: "top",
                    fontSize: 16
                }, {
                    type: "text",
                    text: f,
                    x: 453,
                    y: 272,
                    align: "right",
                    baseline: "top",
                    fontSize: 24
                }, {
                    type: "text",
                    text: g,
                    x: 453,
                    y: 305,
                    align: "right",
                    baseline: "top",
                    fontSize: 16
                }, {
                    type: "text",
                    text: l,
                    x: 110,
                    y: 462,
                    align: "center",
                    baseline: "top",
                    fontSize: 18
                }, {
                    type: "text",
                    text: h,
                    x: 390,
                    y: 462,
                    align: "center",
                    baseline: "top",
                    fontSize: 18
                }, {
                    type: "text",
                    text: (p || 0) + ":" + (u || 0),
                    x: v / 2,
                    y: 365,
                    align: "center",
                    baseline: "top",
                    fontSize: 72,
                    shadow: [ 0, 2, 8, "rgba(0,0,0,0.5)" ]
                }, {
                    type: "text",
                    text: "" + t[this.random(12)],
                    x: v / 2,
                    y: 519,
                    align: "center",
                    baseline: "top",
                    fontSize: 26
                } ]
            };
            this.drawCanvas(w, y), o.aldstat.sendEvent("比分预测 - 生成海报", {
                res: "" + h + p + "比" + u + l,
                f: o.fromWhere
            });
        }
    },
    drawCanvas: function(e, t) {
        var r = this;
        wx.showLoading({
            title: "正在生成中...",
            mask: !0
        });
        var i = [];
        t.mList.forEach(function(t, a) {
            if ("image" === t.type) {
                var n = t.src, o = t.x, s = t.y, c = t.w, l = t.h, d = t.circle;
                i.push(r.drawImage.bind(r, e, n, o, s, c, l, d));
            }
            "text" === t.type && i.push(r.drawText.bind(r, e, t));
        }), (0, n.promiseQueue)(i).then(function(t) {
            console.log("draw"), wx.hideLoading(), e.draw(!1, function() {
                a.default.canvasToTempFilePath({
                    canvasId: "canvas",
                    fileType: "jpg"
                }).then(function(e) {
                    "canvasToTempFilePath:ok" === e.errMsg && a.default.previewImage(e.tempFilePath);
                }).catch(function(e) {
                    wx.hideLoading(), console.error("toTempFile err " + e), wx.showToast({
                        title: "合成失败",
                        icon: "none",
                        mask: !0
                    });
                });
            });
        }).catch(function(e) {
            var t = e.toString().replace(/(\/|:|\s|Error|\.)/g, "-").replace(/-+/g, "-");
            console.log(t), o.aldstat.sendEvent("error - 比分预测 - 合成失败", {
                errMsg: t
            }), wx.hideLoading(), wx.showToast({
                title: "合成失败",
                icon: "none",
                mask: !0
            });
        });
    },
    drawImage: function(e, t, n, r, o, i) {
        var s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
        return a.default.getImageInfo(t).then(function(t) {
            return "getImageInfo:ok" === t.errMsg && (e.beginPath(), s ? (e.save(), e.arc(n + o / 2, r + i / 2, o / 2, 0, 2 * Math.PI, !1), 
            e.clip(), e.drawImage(t.path, n, r, o, i), e.restore()) : e.drawImage(t.path, n, r, o, i)), 
            !0;
        }).catch(function(e) {
            throw new Error(e.errMsg + " 图片地址:" + t);
        });
    },
    drawText: function(t, a) {
        var n = a.text, r = a.x, o = a.y, i = a.align, s = a.baseline, c = a.bold, l = a.fontSize, d = a.color, h = a.shadow, g = a.maxWidth;
        return t.save(), t.setFontSize(l), t.font = "normal " + (c ? "bold" : "normal") + " " + l + "px sans-serif", 
        t.setFillStyle(d || "white"), t.setTextAlign(i || "left"), t.setTextBaseline(s || "top"), 
        h && t.setShadow.apply(t, e(h)), t.fillText(n, r, o, g), t.restore(), Promise.resolve(!0);
    },
    onShareAppMessage: function(e) {
        var t = void 0;
        if (e.target) {
            var a = this.data.list[e.target.dataset.index], n = a.fName, o = a.sName, i = a.score1, s = a.score2;
            t = "https://dl.weshineapp.com/worldcup/share/" + (0, r.md5)(n + "_" + o) + "/" + (i || 0) + "_" + (s || 0) + ".jpg";
        } else t = "https://dl.weshineapp.com/gif/20180626/1529986887_5b31bf47c4938.png";
        return {
            title: "" + [ "买球反着买，别墅靠大海", "买球买冷门，豪车开进门", "买球买强队，天台去排队", "冷门下重注，超越拆迁户", "赌球一分钟，少打十年工", "放手搏一搏，单车换摩托", "买球买豪强，土豪也流浪", "冷门下重注，明天换别墅", "买球若买强，只能住茅房" ][this.random(9)],
            path: "/pages/index/index?go=/pages/guess-score/guess-score&f=sharecard",
            imageUrl: t
        };
    }
});