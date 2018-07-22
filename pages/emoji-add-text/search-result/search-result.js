var t = require("../../../utils/util.js"), e = require("../../../utils/querystring.js"), a = getApp(), i = !0;

Page({
    data: {
        gifList: [],
        keyword: "",
        emopkgTempAPI: a.servPreURL + "templatesearch",
        pagePath: "",
        offset: 0,
        noMore: !1,
        loading: !1
    },
    onLoad: function(t) {
        this.setData({
            keyword: t.kw,
            pagePath: this.route
        }), this.getData(), this.pingSearch(t);
    },
    getData: function() {
        var t = this, o = {
            openid: wx.getStorageSync("weshine::openid")
        };
        i = !1, a.fetchWeshineData({
            method: "POST",
            url: this.data.emopkgTempAPI + (0, e.stringify)({
                keyword: this.data.keyword,
                offset: this.data.offset,
                limit: 30
            }, "?"),
            requestData: o
        }, function(e) {
            if (e.meta.status && "200" == e.meta.status) {
                var a = !!e.data.length, o = e.data;
                a || (o = e.noresult, t.data.noMore = !0, wx.showModal({
                    title: "",
                    content: "暂无搜索结果，闪萌为您推荐热门动作模版",
                    confirmText: "知道了",
                    showCancel: !1
                })), t.setData({
                    gifList: t.data.gifList.concat(o)
                }), t.data.noMore = e.data.length < 30, t.data.offset += 30;
            }
            t.data.loading = !1, setTimeout(function() {
                i = !0;
            }, 500);
        });
    },
    loadMore: function() {
        !i || this.data.noMore || this.data.loading || this.getData();
    },
    goAddfont: function(e) {
        var i = e.currentTarget.dataset.imageInfo;
        (0, t.navigateTo)({
            url: "/pages/emoji-add-text/detail/detail?w=" + i.w + "&h=" + i.h + "&pic=" + i.url + "&id=" + i.id
        }), a.aldstat.sendEvent("表情加字 - 表情点击", {
            id: i.id
        });
    },
    goToSearch: function(t) {
        wx.redirectTo({
            url: "/pages/emoji-add-text/search-result/search-result?refer=input&&kw=" + t.detail.value
        });
    },
    pingSearch: function(t) {
        a.pingback("search.gif", {
            kw: t.kw,
            refer: "letter"
        });
    }
});