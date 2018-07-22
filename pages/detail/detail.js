var t = require("../../utils/util.js"), a = require("../../components/share-guide/share-save.js"), e = getApp(), i = e.servPreURL + "detail", s = e.servPreURL + "emojis";

Page({
    data: {
        collectStatusAPI: e.servPreURL + "wx/collectstatus",
        collectAPI: e.servPreURL + "wx/collect",
        cancelCollectAPI: e.servPreURL + "wx/collectcancel",
        brotherAPI: e.servPreURL + "wx/detailbanner",
        adAPI: e.servPreURL + "wx/adbannerdetail",
        unlockAPI: e.servPreURL + "updatemojislock",
        lockStatusAPI: e.servPreURL + "emolistlock",
        gifList: [],
        gifListCache: [],
        lastIdx: 0,
        offset: 30,
        preview: {},
        status: "",
        id: "",
        w: 0,
        pingRequest: {},
        collected: !1,
        adShow: !1,
        lockPkgName: "",
        lockShow: !1,
        pagePath: "",
        packageId: "",
        firstCover: !0,
        kw: "",
        adList: {},
        adStatus: 0,
        emoList: [],
        emoLock: !1,
        hasPreviewList: !1,
        curEmojiPos: "-",
        curPackageListLength: "-",
        showCopyright: 0,
        desktopTipShow: !1
    },
    onLoad: function(t) {
        this.options = t, this.setData({
            pagePath: this.route,
            packageId: t.lockpkgid || "",
            lockPkgName: t.lockname || ""
        }), this.initLock(t), this.data.id = t.id, this.getDetailData(t.id), this.getCollectStatus(), 
        this.getBrother(), this.initAd(), this.getPkgListData();
    },
    onReady: function() {
        try {
            this.shareComponent = this.selectComponent("#share-component");
        } catch (t) {
            console.error("detail" + t);
        }
    },
    getPkgListData: function() {
        var t = this, a = this.options.lockpkgid;
        if (a) {
            this.setData({
                hasPreviewList: !0
            });
            var i = this.options.id;
            e.fetchWeshineData({
                url: s,
                requestData: {
                    id: a
                }
            }).then(function(a) {
                var e = a.data.map(function(t) {
                    return t.id;
                }), s = e.findIndex(function(t) {
                    return t === i;
                });
                t.setData({
                    curEmojiPos: s + 1,
                    curPackageListLength: e.length,
                    curPackageIdList: e
                });
            });
        }
    },
    next: function() {
        if ("loading" !== this.data.status) {
            var t = this.data.curEmojiPos;
            this.getDetailData(this.data.curPackageIdList[t]), this.setData({
                curEmojiPos: ++t
            });
        }
    },
    prev: function() {
        if ("loading" !== this.data.status) {
            var t = this.data.curEmojiPos;
            this.getDetailData(this.data.curPackageIdList[t - 2]), this.setData({
                curEmojiPos: --t
            });
        }
    },
    loadMore: function() {
        this.data.lastIdx >= this.data.gifListCache.length || (this.data.lastIdx += this.data.offset, 
        this.setData({
            gifList: this.data.gifListCache.slice(0, this.data.lastIdx)
        }));
    },
    shareImage: function() {
        e.pingback("share.gif", this.data.pingRequest);
        try {
            this.shareComponent.share();
        } catch (t) {
            (0, a.wxShare)(this.data.preview.ori);
        }
    },
    saveImage: function() {
        var t = this;
        e.pingback("save.gif", this.data.pingRequest);
        try {
            this.shareComponent.save().then(function(a) {
                a && a.success && setTimeout(function() {
                    t.showDesktopTip();
                }, 1500);
            });
        } catch (t) {
            (0, a.wxShare)(this.data.preview.ori);
        }
    },
    getDetailData: function(t) {
        var a = this;
        this.pingDetail(t), this.setData({
            status: "loading",
            preview: {}
        });
        var s = {
            openid: wx.getStorageSync("weshine::openid")
        }, o = {};
        e.fetchWeshineData({
            method: "post",
            url: i + "?id=" + t,
            requestData: s
        }, function(e) {
            o.preview = e.data.image, a.setData({
                emoList: e.data.emolist
            }), wx.getImageInfo({
                src: e.data.image.thumb,
                success: function(i) {
                    o.preview.thumb = i.path, a.data.id = t, a.data.gifListCache = e.data.related, a.data.lastIdx += a.data.offset, 
                    a.setData({
                        preview: o.preview,
                        status: "",
                        w: 400 * o.preview.w / o.preview.h + "rpx",
                        gifList: a.data.gifListCache.slice(0, a.data.lastIdx),
                        showCopyright: e.data.copyright
                    }), a.getCollectStatus(), a.holdFirstCover();
                }
            }), a.data.emoList.length && a.initEmoLock();
        });
    },
    showPreview: function() {
        try {
            this.shareComponent.share();
        } catch (t) {
            (0, a.wxShare)(this.data.preview.ori);
        }
        e.pingback("viewbigpic.gif", this.data.pingRequest);
    },
    pingDetail: function(t) {
        var a = "";
        "related" === this.options.refer ? a = "related" : this.options.kw && this.options.kw.length ? (this.setData({
            kw: this.options.kw
        }), a = "searchresult") : a = "reco" === this.options.refer ? "reco-" + this.options.reconum : this.options.refer;
        var i = {
            refer: a || "",
            kw: this.options.kw || "",
            picid: t
        };
        this.setData({
            pingRequest: i
        }), e.pingback("viewdetail.gif", i);
    },
    pingReco: function() {
        e.pingback("recotofriend.gif", this.data.pingRequest);
    },
    goReport: function() {
        e.isAuth() ? (0, t.navigateTo)({
            url: "/pages/report/report?id=" + this.data.id
        }) : e.startLogin();
    },
    switchCollect: function() {
        var t = this;
        e.isAuth() ? t.data.collected ? t.cancelCollect() : t.collect() : e.startLogin();
    },
    getCollectStatus: function() {
        var t = this, a = wx.getStorageSync("weshine::openid"), i = {
            openid: a,
            gif_id: t.data.id
        };
        a && e.fetchWeshineData({
            method: "POST",
            url: t.data.collectStatusAPI,
            requestData: i
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data.status;
                "0" == e ? t.setData({
                    collected: !1
                }) : "1" == e && t.setData({
                    collected: !0
                });
            }
        });
    },
    collect: function() {
        var t = this, a = {
            openid: wx.getStorageSync("weshine::openid"),
            gif_id: t.data.id
        };
        e.fetchWeshineData({
            method: "POST",
            url: t.data.collectAPI,
            requestData: a
        }, function(a) {
            a.meta.status && "200" == a.meta.status && t.setData({
                collected: !0
            });
        }), e.pingback("emojifav.gif", t.data.pingRequest);
    },
    cancelCollect: function() {
        var t = this, a = {
            openid: wx.getStorageSync("weshine::openid"),
            gif_id: t.data.id
        };
        e.fetchWeshineData({
            method: "POST",
            url: t.data.cancelCollectAPI,
            requestData: a
        }, function(a) {
            a.meta.status && "200" == a.meta.status && t.setData({
                collected: !1
            });
        });
    },
    getBrother: function() {
        var t = this;
        e.fetchWeshineData({
            url: t.data.brotherAPI
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data, i = {
                    img: e.url,
                    title: e.title,
                    name: e.name,
                    url: e.go_url,
                    path: e.path,
                    appId: e.appId
                };
                t.setData({
                    adStatus: e.status,
                    adList: i
                });
            }
        });
    },
    initLock: function(t) {
        var a = this, i = wx.getStorageSync("weshine::openid"), s = (this.data.packageId, 
        {
            openid: i
        });
        e.fetchWeshineData({
            method: "post",
            url: this.data.lockStatusAPI + "?s=" + e.pingParam.s + "&v=" + e.appVersion + "&aid=" + this.data.packageId,
            requestData: s
        }, function(t) {
            if (t.meta.status && "200" == t.meta.status) {
                var e = t.data;
                e[0].id == a.data.packageId && "1" == e[0].list[0].lock_status && a.setData({
                    lockShow: !0
                }), a.holdFirstCover();
            }
        });
    },
    initEmoLock: function() {
        var t = this;
        this.data.emoList.forEach(function(a) {
            a.lock_status && t.setData({
                emoLock: !0
            });
        });
    },
    doUnlock: function() {
        var t = this, a = {
            openid: wx.getStorageSync("weshine::openid"),
            id: t.data.packageId
        };
        e.fetchWeshineData({
            method: "post",
            url: t.data.unlockAPI,
            requestData: a
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data;
                e.status && "1" == e.status && t.setData({
                    lockShow: !1
                });
            }
        }), e.pingback("sharelockedem.gif", {
            kw: t.data.kw,
            packageid: t.data.packageId
        });
    },
    initAd: function() {
        var t = this;
        e.fetchWeshineData({
            url: this.data.adAPI
        }, function(a) {
            a.meta.status && "200" == a.meta.status && "1" == (a.data.status || "") && t.setData({
                adShow: !0
            });
        });
    },
    holdFirstCover: function() {
        this.requestSuccessCount = this.requestSuccessCount ? ++this.requestSuccessCount : 1, 
        this.requestSuccessCount >= 2 && this.setData({
            firstCover: !1
        });
    },
    goInstruction: function() {
        (0, t.navigateTo)({
            url: "../instruction/instruction"
        }), e.pingback("directionsclick.gif", this.data.pingRequest);
    },
    goAddfont: function() {
        var a = this.data.preview.origin || this.data.preview.ori;
        (0, t.navigateTo)({
            url: "/pages/emoji-add-text/detail/detail?w=" + this.data.preview.w + "&h=" + this.data.preview.h + "&pic=" + a + "&id=" + this.data.id
        }), e.pingback("letterbtnclick.gif", this.data.pingRequest);
    },
    goSoundEmoji: function() {
        (0, t.navigateTo)({
            url: "/pages/sound-emoji/share/share?type=start&id=" + this.data.id
        });
    },
    showDesktopTip: function() {
        var t = this;
        wx.getStorage({
            key: "desktop_tip_showed",
            fail: function() {
                t.setData({
                    desktopTipShow: !0
                }), wx.setStorage({
                    key: "desktop_tip_showed",
                    data: 1
                });
            }
        });
    },
    onShow: function() {
        this.data.emoLock && this.getDetailData(this.data.id);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: e.title,
            desc: e.desc,
            path: "/pages/index/index?path=detail&id=" + t.data.id + "&refer=sharecard&lockname=" + t.data.lockPkgName + "&lockpkgid=" + t.data.packageId,
            imageUrl: this.data.preview.shareImage,
            success: function() {
                t.data.lockShow && t.doUnlock();
            }
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});