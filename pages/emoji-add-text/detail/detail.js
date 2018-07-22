var t = Object.assign || function(t) {
    for (var i = 1; i < arguments.length; i++) {
        var e = arguments[i];
        for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
    }
    return t;
}, i = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("./move.js")), e = require("../../../utils/util.js"), a = require("../../../components/share-guide/share-save.js"), s = getApp(), n = s.servPreURL + "emojifontlist";

Page({
    data: {
        finished: !0,
        status: "loading",
        rawSrc: "",
        currentSrc: "",
        finishedSrc: "",
        currentIndex: 0,
        inputValue: "",
        imgWidth: 500,
        imgHeight: 500,
        textWidth: 40,
        textHeight: 40,
        x: 0,
        y: 0,
        fontsList: [],
        inputFocus: !0,
        inputOpacity: 1,
        hiddenPreview: !1,
        hideMask: !0,
        sizeList: [ {
            name: "小",
            size: 28,
            btnSize: 24
        }, {
            name: "中",
            size: 40,
            btnSize: 28
        }, {
            name: "大",
            size: 52,
            btnSize: 36
        } ],
        sizeCurrent: 1,
        fontSize: 40,
        bgList: [ {
            bg: "transparent"
        }, {
            bg: "white"
        }, {
            bg: "black"
        } ],
        bgCurrent: 0
    },
    onLoad: function(t) {
        this.canUseMoveEvent = wx.canIUse("movable-view.bindchange"), this.options = t, 
        this.cache = {}, this.setImageSize(), this.initTextPosition(), this.getFontsData(), 
        this.canUseMoveEvent || this.initMoveInstance();
    },
    onReady: function() {
        try {
            this.shareComponent = this.selectComponent("#share-component");
        } catch (t) {}
    },
    setImageSize: function() {
        var t = this.options, i = wx.getSystemInfoSync().windowWidth, e = void 0, a = void 0;
        t.w > t.h ? (e = 500, a = Math.round(t.h / t.w * 500)) : (e = Math.round(t.w / t.h * 500), 
        a = 500), this.ratio = i / 750, this.imgRatio = e / 2 / t.w, this.scale = i / 375, 
        this.setData({
            currentSrc: t.pic,
            rawSrc: t.pic,
            imgWidth: e,
            imgHeight: a
        });
    },
    initTextPosition: function() {
        var t = this.data.imgHeight * this.ratio - this.data.textHeight * this.ratio;
        this.boxBottom = t, this.setData({
            x: 40,
            y: t - 10
        }), this.canUseMoveEvent || (this.realPosX = 40, this.realPosY = t);
    },
    initMoveInstance: function() {
        var t = parseInt((500 - this.data.imgHeight) / 2 + 8), e = 125 + 40 / this.ratio, a = parseInt(this.data.imgHeight - this.data.textHeight) + t - 10 / this.ratio;
        this.move = new i.default({
            textX: e,
            textY: a,
            boxLeft: 125,
            boxTop: t,
            width: this.data.imgWidth,
            height: this.data.imgHeight,
            ratio: this.ratio,
            textWidth: this.data.textWidth,
            textHeight: this.data.textHeight,
            scale: this.scale
        });
    },
    thstart: function(t) {
        if (!this.canUseMoveEvent) {
            var i = t.touches[0], e = i.pageX, a = i.pageY;
            this.move.start(e, a, this.data.textWidth, this.data.textHeight);
        }
    },
    thmove: function(t) {
        if (!this.canUseMoveEvent) {
            var i = t.touches[0], e = i.pageX, a = i.pageY;
            this.move.moving(e, a);
        }
    },
    thend: function(t) {
        this.canUseMoveEvent || (this.move.end(), this.move.shouldReset && this.setData({
            x: this.move.offsetX,
            y: this.move.offsetY
        }), this.realPosX = 0 | this.move.offsetX, this.realPosY = 0 | this.move.offsetY);
    },
    positionChange: function(t) {
        var i = t.detail.x, e = t.detail.y;
        e > this.boxBottom && this.setData({
            x: i,
            y: this.boxBottom
        });
        var a = (this.data.imgWidth - this.textWidth) * this.ratio;
        i > a && this.setData({
            x: a,
            y: e
        }), this.realPosX = Math.round(t.detail.x), this.realPosY = Math.round(t.detail.y);
    },
    focusInput: function() {
        this.setData({
            inputFocus: !0
        });
    },
    setValue: function(t) {
        var i = t.detail.value;
        this.setData({
            inputValue: i
        });
    },
    focusHandler: function() {
        this.setData({
            hiddenPreview: !0,
            hideMask: !1,
            inputOpacity: 1
        });
    },
    blurHandler: function() {
        this.setData({
            hiddenPreview: !1,
            hideMask: !0,
            inputOpacity: 0
        });
    },
    changeFontSize: function(t) {
        var i = t.currentTarget.dataset.index, e = this.data.sizeList[i].size;
        this.setData({
            sizeCurrent: i,
            fontSize: e
        });
    },
    changeBg: function(t) {
        var i = t.currentTarget.dataset.index;
        this.setData({
            bgCurrent: i
        });
    },
    getFontsData: function() {
        var i = this;
        s.fetchWeshineData({
            url: n
        }).then(function(e) {
            var a = e.data, s = a.domain, n = a.fonts, o = Object.keys(n).map(function(i) {
                var e = s + n[i].img;
                return t({
                    fkey: i,
                    url: e
                }, n[i]);
            });
            i.setData({
                fontsList: o,
                currentFont: o[0]
            });
        });
    },
    chooseFont: function(t) {
        var i = this.data.fontsList, e = t.currentTarget.dataset.index, a = i[e];
        this.setData({
            currentFont: a,
            currentIndex: e
        });
    },
    getRequestData: function() {
        var t = "";
        try {
            t = wx.getStorageSync("weshine::openid");
        } catch (t) {}
        return {
            url: this.data.rawSrc,
            x: this.realPosX,
            y: this.realPosY,
            font: this.data.currentFont.fkey,
            content: this.data.inputValue,
            font_size: this.data.fontSize / 2,
            width: Math.round(this.data.imgWidth * this.ratio),
            height: Math.round(this.data.imgHeight * this.ratio),
            openid: t,
            bg_color: this.data.bgCurrent + 1
        };
    },
    getEmoji: function() {
        var t = this, i = this.data.inputValue, s = this.getRequestData();
        i ? this.hasCache(s) || this.getEmojiFont(s).then(function(i) {
            if (i) {
                t.tapGetEmojiPingBack(s), t.setCache(s, i);
                try {
                    t.shareComponent.share();
                } catch (i) {
                    (0, a.wxShare)(t.data.finishedSrc);
                }
            }
        }).catch(function(t) {
            throw new Error("表情加字合成失败 " + t);
        }) : (0, e.showErrorModel)("还未输入任何字");
    },
    hasCache: function(t) {
        var i = t.content, e = t.x, s = t.y, n = t.font, o = i + "-" + e + "-" + s + "-" + t.font_size + "-" + t.bg_color + "-" + n, h = this.cache[o];
        if (!h) return !1;
        this.setData({
            finishedSrc: h
        });
        try {
            this.shareComponent.share();
        } catch (t) {
            (0, a.wxShare)(h);
        }
        return !0;
    },
    setCache: function(t, i) {
        var e = t.content, a = t.x, s = t.y, n = t.font, o = e + "-" + a + "-" + s + "-" + t.font_size + "-" + t.bg_color + "-" + n;
        this.cache[o] = i;
    },
    getEmojiFont: function(t) {
        var i = this;
        return this.loading(), s.fetchWeshineData({
            method: "POST",
            url: "https://imagick.weshine.im/v2.0/emojifont",
            requestData: t
        }).then(function(t) {
            return t.data ? (i.setData({
                finished: !0,
                status: "",
                finishedSrc: t.data.url
            }), t.data.url) : ((0, e.showErrorModel)(t.message), Promise.reject(t.message));
        }).catch(function(t) {
            i.setData({
                finished: !0,
                status: ""
            });
        });
    },
    tapGetEmojiPingBack: function(t) {
        var i = t.content, e = t.font, a = t.font_size, n = t.bg_color, o = this.data.bgList[n - 1].bg;
        s.aldstat.sendEvent("加字 - 发出加字合成请求", {
            picid: this.options.id,
            content: i,
            font: e,
            fontSize: a + "",
            bgCurrent: o
        }), s.pingback("createsubtitle.gif", {
            picid: this.options.id,
            letter: this.data.inputValue,
            font: t.font
        });
    },
    loading: function() {
        this.data.finished && this.setData({
            finished: !1,
            status: "loading"
        });
    }
});