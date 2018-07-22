var t = require("../../utils/util.js"), i = getApp(), e = {
    tricksAPI: i.servPreURL + "trickemolist"
};

Page({
    data: {
        tricksData: {},
        pageOptions: {},
        pagePath: ""
    },
    getTricks: function() {
        var t = this;
        i.fetchWeshineData({
            url: e.tricksAPI
        }, function(i) {
            t.setData({
                tricksData: i
            });
        });
    },
    pingbackTricks: function(t) {
        var e = t.currentTarget.dataset.id;
        i.pingback("trick_viewdetail.gif", {
            refer: "list",
            trickid: e
        });
    },
    pingbackShareList: function() {
        i.pingback("trick_sharelistbtn.gif");
    },
    onLoad: function(t) {
        this.getTricks(), this.setData({
            pageOptions: t
        }), this.setData({
            pagePath: this.route
        });
    },
    goColletGuide: function() {
        (0, t.navigateTo)({
            url: "../collect-guide/collect-guide"
        }), i.pingback("trick_guidebtn.gif");
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh(), this.getTricks();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: "套路表情包",
            path: "/pages/all-trick/all-trick?from=share",
            imageUrl: "../../resources/img/cover.png"
        };
    }
});