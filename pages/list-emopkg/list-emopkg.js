var t = require("../../utils/util"), a = getApp();

Page({
    data: {
        title: "闪萌",
        searchAPI: a.servPreURL + "emojis",
        lockStatusAPI: a.servPreURL + "emolistlock",
        unlockAPI: a.servPreURL + "updatemojislock",
        prizeStatusAPI: a.servPreURL + "emojiact",
        prizeTapAPI: a.servPreURL + "receiveact",
        requestData: {},
        gifList: [],
        gifListCache: [],
        lastIdx: 0,
        offset: 30,
        paddingBottom: 20,
        id: "",
        kw: "",
        searchword: "",
        tip: "数据加载中...",
        noResult: "没有您想要的搜索结果！",
        maskImg: "",
        shareShow: !0,
        shareStatus: 0,
        matExist: !1,
        lockPkgName: "",
        lockShow: !1,
        pagePath: "",
        openid: "",
        emojiTip: null,
        musicEmoji: null,
        showFixedVideo: !1,
        showPrize: !1
    },
    onReady: function() {
        var t = this;
        wx.setNavigationBarTitle({
            title: t.data.title.replace("##", "#").replace("##", "#")
        });
    },
    loadMore: function() {
        this.data.lastIdx >= this.data.gifListCache.length || (this.data.lastIdx += this.data.offset, 
        this.setData({
            gifList: this.data.gifListCache.slice(0, this.data.lastIdx)
        }));
    },
    pingbackPkg: function(t) {
        var e, i = this;
        t.searchword ? (i.setData({
            searchword: t.searchword
        }), e = "searchresult") : e = "trick" === t.from ? "trick" : "reco";
        var s = {
            refer: e,
            kw: i.data.searchword || "",
            packageid: t.id
        };
        a.pingback("viewem.gif", s);
    },
    getCard: function() {},
    initLock: function() {
        var t = this, e = wx.getStorageSync("weshine::openid");
        this.setData({
            openid: e
        });
        var i = {
            aid: this.data.id,
            openid: this.data.openid
        };
        a.fetchWeshineData({
            method: "post",
            url: this.data.lockStatusAPI + "?s=" + a.pingParam.s + "&v=" + a.appVersion + "&aid=" + this.data.id,
            requestData: i
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data;
                e[0].id == t.data.id && ("1" == e[0].list[0].lock_status ? t.setData({
                    lockShow: !0
                }) : t.setData({
                    lockShow: !1
                }));
            }
        }), this.setData({
            lockPkgName: this.data.kw
        });
    },
    doUnlock: function() {
        var t = this, e = {
            openid: t.data.openid,
            id: t.data.id
        };
        a.fetchWeshineData({
            method: "post",
            url: t.data.unlockAPI,
            requestData: e
        }, function(a) {
            if (a.meta.status && "200" == a.meta.status) {
                var e = a.data;
                e.status && "1" == e.status && t.setData({
                    lockShow: !1
                });
            }
        }), a.pingback("sharelockedem.gif", {
            kw: t.data.searchword,
            packageid: t.data.id
        });
    },
    getSys: function() {
        var t = this, a = wx.getSystemInfoSync().windowHeight, e = wx.getSystemInfoSync().windowWidth / 750;
        wx.createSelectorQuery().select(".giflist").boundingClientRect(function(i) {
            var s = i.height, o = a - s;
            o > 0 && t.setData({
                paddingBottom: o / e + t.data.paddingBottom
            });
        }).exec();
    },
    gifTap: function(a) {
        var e = "../detail/detail?id=" + a.currentTarget.dataset.item.id + "&refer=package&kw=" + this.data.searchword + "&lockname=" + this.data.lockPkgName + "&lockpkgid=" + this.data.id;
        (0, t.navigateTo)({
            url: e
        });
    },
    onLoad: function(t) {
        var e = this, i = {
            id: t.id
        }, s = t.kw;
        e.setData({
            title: s,
            gifList: [],
            kw: s,
            id: t.id
        }), e.initLock(), a.fetchWeshineData({
            url: e.data.searchAPI,
            requestData: i
        }, function(t) {
            var a = e.data.offset;
            e.data.gifListCache = t.data, e.data.lastIdx = a, e.setData({
                maskImg: t.card,
                gifList: e.data.gifListCache.slice(0, a),
                shareStatus: t.share_status,
                emojiTip: t.tip || "",
                musicEmoji: t.music_tip || ""
            }), t.data.length ? e.setData({
                tip: ""
            }) : e.setData({
                tip: e.data.noResult
            }), "1" == e.data.shareStatus && e.data.shareShow && e.setData({
                matExist: !0
            }), e.getSys();
        }), e.setData({
            pagePath: this.route
        }), e.pingbackPkg(t);
    },
    onShow: function() {
        this.data.lockShow && this.initLock();
    },
    onShareAppMessage: function(t) {
        var e = this;
        if ("button" === t.from && "shareMusicEmoji" === t.target.id) {
            var i = encodeURIComponent("/pages/list-emopkg/list-emopkg?kw=" + this.data.kw + "&id=" + this.data.id);
            return {
                title: "给你推荐「" + this.data.kw + "」表情包",
                path: "/pages/video/video?video=" + this.data.musicEmoji.video + "&backUrl=" + i,
                imageUrl: this.data.musicEmoji.share_img,
                success: function() {
                    e.data.lockShow && e.doUnlock();
                }
            };
        }
        return {
            title: "给你推荐「" + this.data.kw + "」表情包",
            desc: a.desc,
            path: "/pages/index/index?path=list-emopkg&kw=" + this.data.kw + "&id=" + this.data.id,
            imageUrl: this.data.maskImg,
            success: function() {
                e.data.lockShow && e.doUnlock();
            }
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    clickEmojiTip: function() {
        (0, t.navigateTo)({
            url: "/pages/video/video?video=" + encodeURIComponent(this.data.emojiTip.video)
        });
    },
    clickMusicEmoji: function() {
        (0, t.navigateTo)({
            url: "/pages/video/video?video=" + encodeURIComponent(this.data.musicEmoji.video)
        });
    },
    dlMusicEmoji: function() {
        function t() {
            wx.showLoading({
                title: "正在下载视频...",
                mask: !0
            }), wx.downloadFile({
                url: a.data.musicEmoji.video,
                success: function(t) {
                    wx.saveVideoToPhotosAlbum({
                        filePath: t.tempFilePath,
                        success: function() {
                            wx.hideLoading(), wx.showToast({
                                title: "保存成功",
                                icon: "success"
                            });
                        }
                    });
                }
            });
        }
        var a = this;
        wx.getSetting({
            success: function(a) {
                a.authSetting["scope.writePhotosAlbum"] ? t() : !1 === a.authSetting["scope.writePhotosAlbum"] ? wx.showModal({
                    title: "授权通知",
                    content: "为了保证视频能够正常下载，您需要开启您的相册访问权限",
                    confirmText: "现在开启",
                    cancelText: "不用了",
                    success: function(a) {
                        a.confirm && wx.openSetting({
                            success: function(a) {
                                a.authSetting["scope.writePhotosAlbum"] && t();
                            }
                        });
                    }
                }) : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        t();
                    }
                });
            }
        });
    },
    showPrize: function() {
        var t = this, e = wx.getStorageSync("weshine::openid") || "";
        if (e) {
            this.data.openid = e;
            var i = {
                id: 2133,
                openid: e
            };
            a.fetchWeshineData({
                method: "POST",
                url: this.data.prizeStatusAPI,
                requestData: i
            }, function(a) {
                a.meta && a.meta.status && 1 == a.data.is_show && t.setData({
                    showPrize: !0
                });
            });
        } else this.setOpenid();
    },
    clickPrize: function(t) {
        this.setData({
            showPrize: !1
        });
        var e = {
            formid: t.detail.formId,
            id: 2133,
            openid: this.data.openid
        };
        a.fetchWeshineData({
            method: "POST",
            url: this.data.prizeTapAPI,
            requestData: e
        }, function(t) {
            if (t.meta && 200 == t.meta.status) {
                var a = t.data.keyword;
                wx.showModal({
                    content: a,
                    showCancel: !1,
                    confirmText: "好的"
                });
            }
        });
    },
    setOpenid: function() {
        var t = this;
        try {
            a.isAuth() || a.startLogin().then(function(a) {
                if (a.loginAuth) {
                    var e = a.openid;
                    wx.setStorageSync("weshine::openid", e), t.showPrize();
                }
            });
        } catch (a) {
            setTimeout(function() {
                t.setOpenid();
            }, 600);
        }
    }
});