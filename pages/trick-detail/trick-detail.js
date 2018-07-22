var t = getApp(), i = {
    emojiDetailAPI: t.servPreURL + "trickemojidetail"
};

Page({
    data: {
        pageOption: {},
        emojiDetail: "",
        pagePath: ""
    },
    onLoad: function(t) {
        t.title && wx.setNavigationBarTitle({
            title: t.title
        }), this.setData({
            pageOption: t
        }), this.getTrickDetail(), "share" === t.from && this.trickSharePingback(t.trickid), 
        this.setData({
            pagePath: this.route
        });
    },
    getTrickDetail: function() {
        var e = this, a = {
            id: this.data.pageOption.trickid
        };
        t.fetchWeshineData({
            method: "POST",
            url: i.emojiDetailAPI,
            requestData: a
        }, function(t) {
            e.setData({
                emojiDetail: t.data
            });
        });
    },
    trickSharePingback: function(i) {
        t.pingback("trick_viewsharedetail.gif", {
            trickid: this.data.pageOption.trickid
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    toDownload: function() {
        wx.navigateTo({
            url: "/pages/list-emopkg/list-emopkg?id=" + this.data.emojiDetail.id + "&kw=" + this.data.pageOption.title + "&from=trick"
        });
    },
    onShareAppMessage: function() {
        var i = this.data.pageOption;
        return t.pingback("trick_share.gif", {
            trickid: i.trickid
        }), {
            title: i.title,
            path: "/pages/trick-detail/trick-detail?title=" + i.title + "&trickid=" + i.trickid + "&from=share"
        };
    }
});