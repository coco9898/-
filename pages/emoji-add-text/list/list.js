var t = require("../../../utils/util.js"), e = getApp();

Page({
    data: {
        gifList: [],
        emopkgTextListAPI: e.servPreURL + "emojisfontlist",
        pagePath: ""
    },
    onLoad: function() {
        var t = this, a = {
            openid: wx.getStorageSync("weshine::openid")
        };
        this.setData({
            pagePath: this.route
        }), e.fetchWeshineData({
            method: "POST",
            url: this.data.emopkgTextListAPI,
            requestData: a
        }, function(e) {
            if (e.meta.status && "200" == e.meta.status) {
                var a = e.data;
                t.setData({
                    gifList: a
                });
            }
        });
    },
    goAddfont: function(a) {
        var i = a.currentTarget.dataset.imageInfo;
        (0, t.navigateTo)({
            url: "/pages/emoji-add-text/detail/detail?w=" + i.w + "&h=" + i.h + "&pic=" + i.thumb_url + "&id=" + i.id
        }), e.aldstat.sendEvent("表情加字 - 表情点击", {
            id: i.id
        });
    },
    goToPkgList: function(a) {
        var i = a.currentTarget.dataset.imageInfo;
        (0, t.navigateTo)({
            url: "/pages/list-emopkg/list-emopkg?kw=" + i.name + "&id=" + i.id
        }), e.aldstat.sendEvent("表情加字 - 点击查看更多", {
            id: i.id
        });
    },
    goToSearch: function(e) {
        (0, t.navigateTo)({
            url: "/pages/emoji-add-text/search-result/search-result?kw=" + e.detail.value
        });
    }
});