var t = require("../../../utils/util.js"), a = require("../../../utils/querystring"), e = getApp();

Page({
    data: {
        gifAPI: "https://face.weshineapp.com/new_items",
        gifList: [],
        oriDataCache: [],
        gifsCache: [],
        lastIdx: 0,
        offset: 1,
        id: "",
        kw: "",
        tip: "数据加载中...",
        noResult: "没有您想要的搜索结果！",
        replaced: !1,
        replacing: !1,
        maskShow: !1,
        mode: [ "album", "camera" ],
        openid: "",
        scrollTop: 0,
        canvasW: "",
        canvasH: "",
        tplsNum: 0,
        tplSortNum: 0,
        tplSortCount: 0,
        pagePath: "",
        delayLoadOver: !1,
        oriDataLength: 0,
        nomoreTip: ""
    },
    getGifList: function() {
        var t = this;
        if (!t.data.openid) {
            var a = wx.getStorageSync("weshine::openid");
            t.setData({
                openid: a
            });
        }
        var i = {
            uuid: t.data.openid,
            md5: "",
            v: e.appVersion
        };
        wx.request({
            url: t.data.gifAPI,
            data: i,
            method: "GET",
            success: function(a) {
                if (a.statusCode && "200" == a.statusCode) {
                    var e = a.data;
                    t.setData({
                        oriDataLength: e.length,
                        oriDataCache: e
                    });
                    var i = t.data.offset;
                    t.data.lastIdx = i, t.setData({
                        gifsCache: t.data.oriDataCache.slice(0, i),
                        tip: "",
                        scrollTop: 0,
                        tplSortCount: i < t.data.oriDataLength ? i : t.data.oriDataLength
                    }), t.delayLoad();
                }
            },
            fail: function() {
                wx.hideLoading();
            }
        });
    },
    loadMore: function() {
        this.data.offset >= this.data.oriDataLength || this.data.delayLoadOver && this.data.tplSortNum != this.data.oriDataLength - 1 && (this.data.delayLoadOver = !1, 
        this.data.lastIdx += this.data.offset, this.setData({
            gifsCache: this.data.oriDataCache.slice(0, this.data.lastIdx),
            tplSortNum: ++this.data.tplSortNum,
            tplSortCount: this.data.lastIdx < this.data.oriDataLength ? this.data.lastIdx : this.data.oriDataLength
        }), this.delayLoad());
    },
    delayLoad: function() {
        var t = this, a = t.data.gifsCache, e = t.data.gifList, i = t.data.tplsNum, s = t.data.tplSortNum, o = t.data.tplSortCount, d = Object.keys(a[s].tpls), n = d.length, r = e[s] ? e[s].tpls : [];
        r.push(a[s].tpls[d[i]]), e[s] = {
            id: a[s].id,
            name: a[s].name,
            tpls: r
        }, t.setData({
            gifList: e,
            tip: ""
        }), i < n - 1 ? (t.data.tplsNum = ++i, t.delayLoad()) : s < o - 1 ? (t.data.tplsNum = 0, 
        t.data.tplSortNum = ++s, t.delayLoad()) : (t.data.tplsNum = 0, t.data.delayLoadOver = !0, 
        t.getSys(), t.data.gifList.length == t.data.oriDataLength && t.setData({
            nomoreTip: "到底了~"
        }));
    },
    getSys: function() {
        var t = this, a = wx.getSystemInfoSync().windowHeight;
        wx.createSelectorQuery().select(".holder").boundingClientRect(function(e) {
            e && e.bottom - a < 30 && t.loadMore();
        }).exec();
    },
    clickImage: function(e) {
        var i = e.currentTarget.dataset.item, s = {
            showGif: i.have_face,
            ct_id: i.ct_id,
            id: i.id,
            bgm: i.bgm
        };
        (0, t.navigateTo)({
            url: "/pages/change-face/custom-made-share/custom-made-share" + (0, a.stringify)(s, "?")
        });
    },
    resetData: function() {
        this.setData({
            offset: 1,
            gifList: [],
            tplSortNum: 0,
            delayLoadOver: !1
        });
    },
    onLoad: function() {
        var t = this;
        t.getGifList(), t.setData({
            pagePath: this.route
        });
    },
    onShow: function() {},
    onShareAppMessage: function() {
        return {
            title: e.title,
            desc: e.desc,
            path: "/pages/index/index?go=" + encodeURIComponent("/pages/change-face/custom-made/custom-made")
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});