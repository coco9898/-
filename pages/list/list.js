var t = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var e = arguments[a];
        for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
    }
    return t;
}, a = require("../../utils/util"), e = getApp(), s = !1, i = e.servPreURL + "wx/searchicons";

Page({
    data: {
        title: "闪萌",
        searchAPI: e.servPreURL + "search_3",
        hotcardAPI: e.servPreURL + "search_hotcard",
        listcardAPI: e.servPreURL + "search_listcard",
        checkwordAPI: e.servPreURL + "search_checkword",
        magicAPI: e.servPreURL + "text2img/create",
        brotherAPI: e.servPreURL + "wx/searchbanner",
        requestData: {},
        emoList: [],
        hotList: [],
        hotListDish: [],
        gifList: [],
        relatesList: [],
        magicSrc: "",
        callbackStatusArray: [],
        kw: "",
        tip: "数据加载中...",
        haveResult: !0,
        showBlank: !1,
        shareShow: !1,
        timer: 2e3,
        maskImg: "",
        onlyDataHot: "",
        dangerWord: !1,
        shareStatus: 0,
        pagePath: "",
        lockShow: !1,
        adList: {},
        adStatus: 0,
        options: {},
        webUrl: "",
        iconsList: [],
        pageLink: {}
    },
    onReady: function() {
        var t = this;
        wx.setNavigationBarTitle({
            title: t.data.title.replace("##", "#").replace("##", "#")
        });
    },
    loadMore: function() {
        if (!s && this.data.haveResult) {
            var t = this, a = t.data.requestData;
            s = !0, e.fetchWeshineData({
                url: t.data.searchAPI,
                requestData: a
            }, function(e) {
                a.offset = parseInt(a.offset) + parseInt(e.pagination.count), t.setData({
                    gifList: t.data.gifList.concat(e.data),
                    requestData: a
                }), setTimeout(function() {
                    s = !1;
                }, 500);
            });
        }
    },
    getDataHot: function(t) {
        var a = this, s = {
            keyword: t.kw,
            block: t.block || "hot",
            limit: 30,
            offset: 0
        }, i = t.kw;
        a.setData({
            title: t.kw,
            gifList: {},
            kw: i
        });
        var r = t.block || "hot", o = a.data.searchAPI + "?keyword=" + t.kw + "&block=" + r + "&limit=30&offset=0", n = {
            openid: wx.getStorageSync("weshine::openid")
        };
        e.fetchWeshineData({
            method: "post",
            url: o,
            requestData: n
        }, function(e) {
            s.offset = parseInt(s.offset) + parseInt(e.pagination.count), a.setData({
                shareStatus: e.share_status
            }), a.setData({
                hotListDish: e.data.hot || [],
                emoList: e.data.emolist || [],
                requestData: s,
                relatesList: e.data.relate_gifs
            }), e.data.hot.length || e.data.emolist.length ? a.setData({
                tip: ""
            }) : (a.setData({
                haveResult: !1,
                showBlank: !0,
                tip: ""
            }), a.getMagicData()), e.data.card_img && a.setData({
                maskImg: e.data.card_img
            }), a.data.emoList.length && a.initEmoLock(), e.searchThrough && 1 == e.searchThrough.through && a.setData({
                pageLink: e.searchThrough
            }), a.getDataList(t);
        });
    },
    initEmoLock: function() {
        var t = this;
        this.data.emoList.forEach(function(a) {
            a.lock_status && t.setData({
                lockShow: !0
            });
        });
    },
    stopPropagation: function() {},
    getDataList: function(t) {
        var a = this, s = {
            keyword: t.kw,
            block: "list",
            limit: 30,
            offset: 0
        };
        e.fetchWeshineData({
            url: a.data.searchAPI,
            requestData: s
        }, function(t) {
            s.offset = parseInt(s.offset) + parseInt(t.pagination.count);
            var e = a.data.haveResult && !t.data.length;
            a.setData({
                onlyDataHot: e
            }), a.setData({
                requestData: s,
                hotList: e ? [] : a.data.hotListDish,
                gifList: e ? a.data.hotListDish : t.data || []
            }), t.data.length <= 15 && a.getDataRelate(), (a.data.hotList.length || a.data.gifList.length >= 6) && a.setData({
                shareShow: !0
            });
        });
    },
    getDataRelate: function() {
        var t = this, a = {
            keyword: t.data.title,
            block: "emoji",
            limit: 30,
            offset: 0
        };
        e.fetchWeshineData({
            url: t.data.searchAPI,
            requestData: a
        }, function(e) {
            a.offset = parseInt(a.offset) + parseInt(e.pagination.count), e.data[0] && e.data[0].items && t.setData({
                relatesList: e.data || []
            });
        });
    },
    getMagicData: function() {
        var t = this, a = {
            text: t.data.title
        };
        e.fetchWeshineData({
            url: t.data.magicAPI + "?thumb=1",
            requestData: a,
            method: "POST"
        }, function(a) {
            200 == a.meta.status && t.setData({
                magicSrc: a.data.img || ""
            });
        });
    },
    pingSearch: function(t) {
        if ("hotword" == t.refer) a = {
            kw: t.kw,
            refer: "hotword"
        }; else var a = {
            kw: t.kw,
            refer: "input"
        };
        e.pingback("search.gif", a);
    },
    getCard: function() {
        var t = this;
        if (t.data.onlyDataHot) {
            a = {
                keyword: t.data.title,
                block: "list",
                limit: 30,
                offset: 0
            };
            e.fetchWeshineData({
                url: t.data.listcardAPI,
                requestData: a
            }, function(a) {
                if (a.meta.status && "200" == a.meta.status) {
                    var e = a.data;
                    wx.getImageInfo({
                        src: e,
                        success: function(a) {
                            t.setData({
                                maskImg: a.path
                            });
                        }
                    });
                }
            });
        } else {
            var a = {
                keyword: t.data.title,
                block: "hot",
                limit: 30,
                offset: 0
            };
            e.fetchWeshineData({
                url: t.data.hotcardAPI,
                requestData: a
            }, function(a) {
                if (a.meta.status && "200" == a.meta.status) {
                    var e = a.data;
                    wx.getImageInfo({
                        src: e,
                        success: function(a) {
                            t.setData({
                                maskImg: a.path
                            });
                        }
                    });
                }
            });
        }
    },
    checkWord: function(t) {
        var a = this;
        e.fetchWeshineData({
            url: this.data.checkwordAPI,
            requestData: {
                keyword: t.kw
            }
        }).then(function(s) {
            1 === s.data ? e.fetchWeshineData({
                url: i
            }).then(function(t) {
                var e = t.data.domain, s = t.data.icons.list, i = t.data.icons.status;
                s = s.map(function(t) {
                    return t.img = e + t.img, a.getNavgateType(t);
                }), a.setData({
                    iconsList: s,
                    iconsStatus: i,
                    dangerWord: !0,
                    tip: ""
                });
            }) : a.getDataHot(t);
        });
    },
    openUrl: function(t) {
        this.setData({
            webUrl: t.detail.url
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
    getBrother: function() {
        var t = this;
        e.fetchWeshineData({
            url: t.data.brotherAPI
        }, function(a) {
            if (a.meta.status && 200 == a.meta.status) {
                var e = a.data;
                t.setData({
                    adList: e.list,
                    adStatus: e.status
                });
            }
        });
    },
    goDetail: function(t) {
        var e = "../detail/detail?id=" + t.currentTarget.dataset.item.id + "&refer=searchresult&kw=" + this.data.kw;
        (0, a.navigateTo)({
            url: e
        });
    },
    goRelate: function(t) {
        var e = t.currentTarget.dataset.item;
        console.log(e);
        var s = "../detail/detail?id=" + e.id + "&refer=related&kw=" + this.data.kw;
        (0, a.navigateTo)({
            url: s
        });
    },
    goRelateList: function(t) {
        var e = "../list/list?kw=" + t.currentTarget.dataset.name;
        (0, a.navigateTo)({
            url: e
        });
    },
    goMagic: function() {
        (0, a.navigateTo)({
            url: "../magic/magic?kw=" + this.data.title + "&refer=magic"
        });
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            options: t
        }), a.checkWord(t), a.getBrother(), a.pingSearch(t), a.setData({
            pagePath: a.route
        });
    },
    onShow: function() {
        this.data.lockShow && this.getDataHot(this.data.options);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: e.title,
            desc: e.desc,
            imageUrl: t.data.maskImg,
            path: "/pages/index/index?path=list&kw=" + this.data.kw
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});