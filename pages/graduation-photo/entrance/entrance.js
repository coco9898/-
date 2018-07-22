function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

require("../../../utils/util.js");

var e = getApp(), i = !0, a = e.servPreURL + "groupphoto/getbgmusic", n = e.servPreURL + "groupphoto/createphoto", s = [ {
    cx: 188,
    cy: 145
} ], o = [ 9, 20, 30, 35, 40 ], r = [ 1.2, 1, .95, .8, .7 ], c = 0, d = {
    w1: 35,
    w: 59,
    h: 88.5
}, h = {
    width: 1050,
    height: 700
};

Page({
    data: {
        uploadUrl: "https://imagick.weshine.im/v2.0/custom/upload",
        wordsLimit: 18,
        peopleLimit: 40,
        backgroundId: 0,
        background: "",
        content: "",
        num: 6,
        openid: "",
        backgroundList: [],
        contentFocus: !1,
        bgMusic: "",
        w1: d.w1,
        w: d.w,
        h: d.h,
        seatArr: [],
        creating: !1,
        scrollTop: 0,
        scrollHeight: 0,
        titlePlaceholder: "",
        numArr: [],
        pickerChange: !1,
        trimedImg: "",
        trimConfig: h,
        uploadRes: "",
        swipeList: [ {
            src: "https://dl.weshineapp.com/gif/20180611/1528717881_5b1e6239d0108.png",
            text: "与室友"
        }, {
            src: "https://dl.weshineapp.com/gif/20180611/1528717902_5b1e624e5ea19.png",
            text: "与同学"
        }, {
            src: "https://dl.weshineapp.com/gif/20180611/1528717812_5b1e61f4f2328.png",
            text: "与闺蜜"
        }, {
            src: "https://dl.weshineapp.com/gif/20180611/1528717844_5b1e6214da149.png",
            text: "与兄弟"
        }, {
            src: "https://dl.weshineapp.com/gif/20180611/1528717919_5b1e625fe7afb.png",
            text: "与队友"
        } ],
        hideGuide: !1
    },
    onLoad: function(t) {
        var i = this;
        e.pingback("photo_creat.gif", {
            refer: t.refer || "",
            f: e.fromWhere
        });
        var a = wx.getStorageSync("weshine::openid") || "", n = wx.getStorageSync("hide-entrance-guide");
        a && (this.setData({
            openid: a,
            hideGuide: n
        }), wx.getUserInfo({
            success: function(t) {
                var e = (t.userInfo.nickName || "我") + "和小伙伴们";
                i.setData({
                    titlePlaceholder: e
                });
            }
        })), this.initNumArr(), this.getData(), this.betterLayout(), this.confirmNum(), 
        e.aldstat.sendEvent("毕业照 - 场景定制页 - 进入页面", {});
    },
    onShow: function() {
        this.selectComponent("#music-component").onShow(), this.receiveTrimed();
    },
    onHide: function() {
        this.selectComponent("#music-component").onHide(), i = !1;
    },
    onShareAppMessage: function() {
        return {
            title: " ",
            path: "/pages/index/index?go=/pages/graduation-photo/entrance/entrance"
        };
    },
    initNumArr: function() {
        for (var t = [], e = 1; e <= 40; e++) t.push(e);
        this.setData({
            numArr: t
        });
    },
    getData: function() {
        var t = this, i = this.data.openid;
        e.fetchWeshineData({
            method: "POST",
            url: a,
            requestData: {
                openid: i
            }
        }, function(e) {
            if (e.meta && 200 == e.meta.status) {
                var i = e.data, a = i.background;
                t.setData({
                    backgroundList: a,
                    backgroundId: a[0].id,
                    background: a[0].url,
                    bgMusic: a[0].music_url || i.music && i.music[0].url || ""
                });
            }
        });
    },
    inputEvent: function(e) {
        var i = e.currentTarget.dataset.key, a = e.detail.value;
        if (a) {
            var n = "";
            if ("content" === i && a.length > 18 && (n = "横幅内容不可以超过 18 个字符哦", this.setData({
                content: a.substring(0, 18)
            })), n) return void wx.showModal({
                title: "",
                content: n,
                confirmText: "知道了",
                showCancel: !1
            });
        }
        this.setData(t({}, i, a));
    },
    chooseNum: function(t) {
        var e = t.detail.value, i = this.data.numArr;
        this.data.pickerChange || this.setData({
            pickerChange: !0
        }), this.setData({
            num: i[e]
        }), this.confirmNum();
    },
    chooseBackground: function(t) {
        var e = t.currentTarget.dataset.value;
        console.log("index", e);
        var i = this.data.backgroundList[e];
        this.setData({
            uploadRes: "",
            backgroundId: i.id,
            background: i.url,
            bgMusic: i.music_url
        });
    },
    bannerTap: function() {
        this.data.bannerFocus || this.setData({
            scrollTop: 0,
            contentFocus: !0
        });
    },
    getUserInfo: function(t) {
        var i = this;
        t.detail.userInfo && e.startLogin().then(function(t) {
            if (t.loginAuth) {
                var e = t.openid;
                i.setData({
                    openid: e
                }), i.create();
            }
        });
    },
    create: function() {
        var t = this;
        this.data.content ? this.getCompoundUrl() : wx.getUserInfo({
            success: function(e) {
                var i = e.userInfo.nickName || "我";
                t.data.content = i + "和小伙伴们", t.getCompoundUrl();
            },
            fail: function() {
                t.data.content = "我和小伙伴们", t.getCompoundUrl();
            }
        });
    },
    getCompoundUrl: function() {
        var t = this;
        wx.showLoading({
            title: "生成中",
            mask: !0
        });
        var i = void 0, a = this.data.content, n = "", s = "";
        this.data.uploadRes ? (i = "https://imagick.weshine.im/v2.0/custom/custombg", s = this.data.uploadRes) : (i = "https://imagick.weshine.im/v2.0/custom/background", 
        n = this.data.backgroundId + "");
        var o = {
            bg_id: n,
            bg_title: a,
            bg_path: s
        };
        e.fetchWeshineData({
            method: "POST",
            url: i,
            requestData: o
        }, function(e) {
            if (e.meta && 200 == e.meta.status) {
                var i = e.data.img_url;
                t.data.compound_url = i, t.getPhotoId();
            } else wx.showModal({
                title: "提示",
                content: e.message,
                showCancel: !1,
                confirmText: "我知道了"
            }), wx.hideLoading();
        });
    },
    getPhotoId: function() {
        var t = this;
        if (!this.data.creating) {
            this.data.creating = !0;
            var i = this.data, a = this.data.openid, s = i.content, o = i.compound_url, r = +i.num || 40, c = i.background, d = i.bgMusic, h = {
                openid: a,
                streamer: s,
                compound_url: o,
                people_num: r,
                bground_url: c,
                music_url: d
            };
            e.aldstat.sendEvent("毕业照 - 场景定制页 - 确认创建", {
                openid: a,
                streamer: s,
                f: e.fromWhere
            }), e.pingback("photo_new.gif", {
                num: r,
                bg: this.data.backgroundId,
                f: e.fromWhere
            }), e.fetchWeshineData({
                method: "POST",
                url: n,
                requestData: h
            }, function(i) {
                if (i.meta.status && 200 == i.meta.status) {
                    var n = i.data;
                    wx.hideLoading(), e.aldstat.sendEvent("毕业照 - 场景定制页 - 创建成功", {
                        openid: a,
                        streamer: s,
                        f: e.fromWhere
                    }), wx.redirectTo({
                        url: "/pages/graduation-photo/processing/processing?photo_id=" + n.photo_id
                    });
                } else t.data.creating = !1, wx.hideLoading();
            });
        }
    },
    confirmNum: function() {
        for (var t = this.data.num, e = [], i = 0; i < t; i++) e.push({});
        this.setData({
            seatArr: e
        }), this.setParams();
    },
    betterLayout: function() {
        var t = this, e = wx.getSystemInfoSync(), i = (e.windowHeight, 750 / e.windowWidth);
        wx.createSelectorQuery().select(".btn-wrap").boundingClientRect(function(e) {
            if (e) {
                var a = e.top * i - 612 - 4;
                t.setData({
                    scrollHeight: a
                });
            }
        }).exec();
    },
    receiveTrimed: function() {
        if (!i) {
            var t = e.trimedImg;
            t && (e.trimedImg = "", this.setData({
                trimedImg: t
            }));
        }
    },
    prettyTrimedImg: function(t) {
        var e = this, i = wx.createCanvasContext("myCanvas");
        i.drawImage(t, 0, 0, h.width, h.height), i.draw(!1, function(t) {
            wx.canvasToTempFilePath({
                canvasId: "myCanvas",
                x: 0,
                y: 0,
                width: h.width,
                height: h.height,
                success: function(t) {
                    var i = t.tempFilePath;
                    e.setData({
                        trimedImg: i
                    });
                }
            });
        });
    },
    receiveUploadedPath: function(t) {
        var e = t.detail.item.content;
        this.setData({
            uploadRes: e,
            background: this.data.trimedImg,
            backgroundId: -1,
            bgMusic: this.data.backgroundList[0].music_url
        });
    },
    uploadTap: function() {
        e.aldstat.sendEvent("毕业照 - 场景定制页 - 点击自定义上传", {});
    },
    setParams: function() {
        s = [ {
            cx: 188,
            cy: 145
        } ], o = [ 9, 20, 30, 35, 40 ], r = [ 1.2, 1, .95, .8, .7 ], c = 0;
        var t = this.data.seatArr.length, e = this.data, i = (e.w1, e.w, e.h, r[1]);
        if (i = t < o[0] ? r[0] : t < o[1] ? r[1] : t < o[2] ? r[2] : t < o[3] ? r[3] : r[4], 
        this.setData({
            w1: d.w1 * i,
            w: d.w * i,
            h: d.h * i
        }), t > 8 && t <= 17) {
            var a = Math.floor(t / 2);
            s.unshift({
                cx: s[0].cx,
                cy: s[0].cy - 32
            }), this.initPosition(0, a + 1, 0), this.initPosition(1, t - a - 1, a + 1);
        } else if (t > 17) {
            var n = Math.floor(t / 3);
            s.push({
                cx: s[0].cx,
                cy: s[0].cy + 32
            }), s.unshift({
                cx: s[0].cx,
                cy: s[0].cy - 32
            }), n === t - 2 * n - 1 ? (this.initPosition(0, n, 0), this.initPosition(1, n + 1, n), 
            this.initPosition(2, n, 2 * n + 1)) : (this.initPosition(0, n + 1, 0), this.initPosition(1, n, n + 1), 
            this.initPosition(2, t - 2 * n - 1, 2 * n + 1));
        } else this.initPosition(0, t, 0);
    },
    initPosition: function(e, i, a) {
        var n = Math.ceil(i / 2), o = s[e].cy - this.data.h / 2;
        c = (this.data.w - this.data.w1) / 2;
        for (var r = 0; r < i; r++) {
            var d = s[e].cx + this.data.w1 / 2 - this.data.w1 * (n - r) - c;
            i % 2 == 0 && (d = s[e].cx - this.data.w1 * (n - r) - c);
            var h = this.data.seatArr[r + a];
            h.x = d, h.y = o;
            var u = "seatArr[" + (r + a) + "]";
            this.setData(t({}, u, h));
        }
    },
    closeGuideModal: function(t) {
        wx.setStorageSync("hide-entrance-guide", !0), this.setData({
            hideGuide: !0
        });
    }
});