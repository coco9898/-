var t = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var e = arguments[a];
        for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    }
    return t;
}, a = require("../../utils/util.js"), e = getApp(), i = e.servPreURL + "wx/homebanners";

Page({
    data: {
        hotwordsAPI: e.servPreURL + "hotwords",
        hotEmojiPkgsAPI: e.servPreURL + "hotemojis",
        lockPkgsAPI: e.servPreURL + "hotemojislock",
        hotGifsAPI: e.servPreURL + "hotgifs",
        collCountAPI: e.servPreURL + "wx/collectcount",
        tricksAPI: e.servPreURL + "trickemojis",
        formSubmitAPI: e.servPreURL + "wx/template",
        synListAPI: e.servPreURL + "synthesis/synlist",
        hotwords: [],
        emojiPkgs: [],
        emojiPkgsCache: [],
        gifs: [],
        synList: [],
        hotTagCount: 6,
        failCount: 0,
        colors: {
            new: "ForestGreen",
            reco: "DodgerBlue",
            hot: "DeepPink",
            selfmade: "Orange"
        },
        tags: {
            new: "新",
            hot: "热",
            selfmade: "自制"
        },
        searchValue: "",
        changeTimes: 0,
        copyrightLink: e.copyrightLink,
        banner: "",
        banners: "",
        iconsBanner: "",
        actUrl: "",
        actKwUrl: "",
        actKeyword: "",
        collectNum: 0,
        webUrl: "",
        tricksData: "",
        animationData: {},
        oldTop: 0,
        tranY: 0,
        fixedBottom: 28,
        bottomClass: "bottom-fixed-show",
        gifsOffset: 0,
        gifsLimit: 33,
        searchFocus: !1,
        hideSearchList: !1,
        universalMakeData: {}
    },
    initBannersData: function() {
        var t = this, a = wx.getStorageSync("weshine::openid") || "", s = i, o = {
            openid: a
        };
        e.fetchWeshineData({
            url: s,
            requestData: o,
            method: "post"
        }).then(function(a) {
            if (!a.data) throw new Error("homebanners接口返回错误：" + a.errMsg);
            var e = a.data, i = e.banner, s = e.banners, o = e.icons, n = e.link, r = e.domain;
            i.list.img = r + i.list.img, i.list = t.getNavgateType(i.list), s.list = t.handleBannerData(s.list, r), 
            o.list = t.handleBannerData(o.list, r), n.list.img = r + n.list.img;
            var c = n;
            t.setData({
                banner: i,
                banners: s,
                iconsBanner: o,
                adStatus: c.status,
                adList: c.list
            });
        });
    },
    handleBannerData: function(t, a) {
        var e = this;
        return t.map(function(t) {
            return t.img = a + t.img, e.getNavgateType(t);
        });
    },
    getNavgateType: function(a) {
        return a.appId ? t({}, a, {
            type: "app"
        }) : a.path ? t({}, a, {
            type: "page"
        }) : a.url ? t({}, a, {
            type: "h5"
        }) : a;
    },
    bannertap: function() {
        var t = this.data.banner.list;
        "page" === t.type ? e.pingback("hd_entranceclick.gif", {
            refer: "banner"
        }) : "h5" === t.type && this.setData({
            webUrl: t.url
        }), (0, a.navigate)(this.data.banner.list, e.loginData.loginAuth);
    },
    getHotWords: function(t) {
        var a = this, i = {
            limit: 6,
            offset: 6 * this.data.changeTimes
        };
        i.offset >= this.hotTagCount && (i.offset = 0, this.data.changeTimes = 0), e.fetchWeshineData({
            url: this.data.hotwordsAPI,
            requestData: i
        }, function(t) {
            var e = /([\u4e00-\u9fa5])+/g;
            if (200 == t.meta.status) {
                t.data.map(function(t, a) {
                    return e.test(t.word) ? t.sword = t.word.slice(0, 5) : t.sword = t.word.slice(0, 10);
                }), a.setData({
                    hotwords: t.data
                });
                var s = t.actdata || {};
                s.url && a.setData({
                    searchValue: s.keyword,
                    actKwUrl: s.url || "",
                    actKeyword: s.keyword || ""
                }), a.data.changeTimes = (a.data.changeTimes + 1) % t.pagination.totalPage, a.hotTagCount = t.pagination.totalCount;
                var o = i.offset > a.hotTagCount - 6 ? 0 : Math.floor(6 * Math.random()), n = t.data[o] ? t.data[o].word : "";
                a.setData({
                    searchValue: n
                });
            }
        }), t && e.pingback("hotwordschange.gif");
    },
    getEmojiPkgs: function() {
        var t = this, a = {};
        e.fetchWeshineData({
            url: t.data.hotEmojiPkgsAPI,
            requestData: a
        }, function(a) {
            200 == a.meta.status && (t.setData({
                emojiPkgsCache: a.data
            }), t.getLockPkgs());
        });
    },
    getLockPkgs: function() {
        var t = this, a = {
            openid: wx.getStorageSync("weshine::openid"),
            id: 1
        };
        e.fetchWeshineData({
            method: "post",
            url: t.data.lockPkgsAPI,
            requestData: a
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data, i = e.length, s = t.data.emojiPkgsCache.map(function(t, a) {
                    for (var s = t, o = t.id, n = 0; n < i; n++) e[n].id == o && (s.lock_status = e[n].lock_status);
                    return s;
                });
                t.setData({
                    emojiPkgs: s
                });
            }
        });
    },
    openUrl: function(t) {
        this.setData({
            webUrl: t.detail.url
        });
    },
    getHotGifs: function() {
        var t = this, a = {
            limit: t.data.gifsLimit,
            offset: t.data.gifsOffset
        };
        e.fetchWeshineData({
            url: t.data.hotGifsAPI,
            requestData: a
        }, function(a) {
            200 == a.meta.status && t.setData({
                gifs: t.data.gifs.concat(a.data),
                gifsOffset: t.data.gifsOffset + t.data.gifsLimit
            });
        });
    },
    getTricks: function() {
        var t = this;
        e.fetchWeshineData({
            url: this.data.tricksAPI
        }, function(a) {
            t.setData({
                tricksData: a
            });
        });
    },
    pingbackTricks: function(t) {
        var a = t.currentTarget.dataset.id;
        e.pingback("trick_viewdetail.gif", {
            refer: "index",
            trickid: a
        });
    },
    pingpackToAllTricks: function() {
        e.pingback("trick_viewall.gif", {
            refer: "index"
        });
    },
    homeTransit: function(t) {
        if (t.path) {
            var i = t.path, s = "";
            for (var o in t) "path" != o && (s += o + "=" + t[o] + "&");
            n = "/pages/" + i + "/" + i + "?" + (s = s.substring(0, s.length - 1));
            if (this.pathMapping({
                path: i,
                paramStr: s
            })) return;
            e.pingback("viewshare.gif", {
                page: n
            }), (0, a.navigateTo)({
                url: n
            });
        } else if (t.go) {
            var n = decodeURIComponent(t.go);
            wx.navigateTo({
                url: n
            });
        }
    },
    pathMapping: function(t) {
        var a = t.path, i = t.paramStr;
        if (a && "custom-made-show" == a) {
            var s = "/pages/change-face/custom-made-show/custom-made-show?" + i;
            wx.navigateTo({
                url: s,
                success: function(t) {
                    e.pingback("viewshare.gif", {
                        page: s
                    });
                }
            });
        }
    },
    clickEmojiPkg: function(t) {
        var e = t.currentTarget.dataset.emoji;
        if (e.url) (0, a.navigateTo)({
            url: e.url
        }); else {
            var i = "../list-emopkg/list-emopkg?kw=" + e.name + "&id=" + e.id;
            (0, a.navigateTo)({
                url: i
            });
        }
    },
    getCollectCount: function() {
        var t = this;
        wx.getStorage({
            key: "weshine::openid",
            success: function(a) {
                var i = {
                    openid: a.data
                };
                e.fetchWeshineData({
                    url: t.data.collCountAPI,
                    requestData: i,
                    method: "POST"
                }, function(a) {
                    var e = a.data;
                    t.setData({
                        collectNum: e
                    });
                });
            }
        });
    },
    goCollects: function() {
        this.pingMenu(), e.isAuth() ? (0, a.navigateTo)({
            url: "../collects/collects"
        }) : e.startLogin().then(function(t) {
            t.loginAuth && (0, a.navigateTo)({
                url: "../collects/collects"
            });
        });
    },
    getSynList: function() {
        var t = this;
        e.fetchWeshineData({
            url: t.data.synListAPI,
            requestData: {
                offset: 0,
                limit: 2
            }
        }, function(a) {
            if (200 == a.meta.status) {
                var e = {
                    icon: a.icon,
                    name: a.name,
                    status: a.status
                };
                t.setData({
                    synList: a.data,
                    universalMakeData: e
                });
            }
        });
    },
    pingMenu: function(t) {
        var a = {
            menuname: t ? t.currentTarget.dataset.type : "myfav"
        };
        e.pingback("floatbtn.gif", a);
    },
    formSubmit: function(t) {
        var i = t.detail.value, s = t.detail.referHotword;
        i === this.data.actKeyword ? (e.pingback("hd_entranceclick.gif", {
            refer: "search"
        }), (0, a.navigateTo)({
            url: this.data.actKwUrl
        })) : s ? (0, a.navigateTo)({
            url: "/pages/list/list?refer=hotword&kw=" + i
        }) : (0, a.navigateTo)({
            url: "/pages/list/list?kw=" + i
        });
    },
    bindscroll: function(t) {
        var a = t > this.data.oldTop;
        a && "bottom-fixed-show" == this.data.bottomClass ? this.setData({
            bottomClass: "bottom-fixed-hide"
        }) : a || "bottom-fixed-show" == this.data.bottomClass || this.setData({
            bottomClass: "bottom-fixed-show"
        }), this.data.oldTop = t;
    },
    mytest: function() {
        var t = wx.getStorageSync("weshine::openid");
        this.data.emojiPkgsCache.length;
        !function(a) {
            var i = {
                openid: t,
                id: a
            };
            e.fetchWeshineData({
                method: "post",
                url: "https://mp.weshineapp.com/2.0/updatemojislock?type=add",
                requestData: i
            }, function(t) {});
        }(1396), console.log("mytest");
    },
    hotWordsSubmit: function(t) {
        var i = t.detail.formId || "", s = t.detail.target.dataset.kw || "", o = wx.getStorageSync("weshine::openid") || "", n = {
            form_id: i,
            openid: o,
            kw: s,
            type: 1
        };
        o && e.fetchWeshineData({
            url: this.data.formSubmitAPI,
            requestData: n,
            method: "POST"
        });
        var r = "../list/list?kw=" + s + "&refer=hotword";
        (0, a.navigateTo)({
            url: r
        });
    },
    onLoad: function(t) {
        var a = !1;
        "topsearch" === t.from && (a = !0);
        var e = this;
        this.setData({
            gifs: [],
            gifsOffset: 0,
            searchFocus: a
        }), e.homeTransit(t), e.initBannersData(), e.getTricks(), e.getHotWords(), e.getSynList(), 
        e.getHotGifs();
    },
    onUnload: function() {
        wx.setStorage({
            key: "relaunchShowed",
            data: "0"
        });
    },
    onShow: function() {
        this.getCollectCount(), this.getEmojiPkgs();
    },
    onShareAppMessage: function() {
        return {
            title: e.title,
            desc: e.desc,
            path: "/pages/index/index?f=" + e.fromWhere
        };
    },
    onPageScroll: function(t) {
        var a = t.scrollTop;
        a < 0 || this.bindscroll(a);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
        this.onLoad(""), this.onShow(), wx.setStorage({
            key: "relaunchShowed",
            data: "0"
        });
    },
    onReachBottom: function() {
        this.getHotGifs();
    },
    goAssistant: function(t) {
        this.pingMenu(t), (0, a.navigateTo)({
            url: "/pages/assistant/assistant"
        });
    }
});