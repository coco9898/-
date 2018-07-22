var t = getApp(), e = t.servPreURL + "groupphoto/landingpage";

Page({
    data: {
        img: ""
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "合照大作战"
        }), this.getImg(), t.aldstat.sendEvent("毕业照 - 落地页 - 进入页面", {}), t.pingback("photo_landing.gif", {
            refer: e.refer || "",
            f: t.fromWhere
        });
    },
    onShareAppMessage: function() {
        return {
            title: "2018年最酷最好玩的合影，赶紧做第一批走在网红前沿的人啊！",
            path: "/pages/index/index?go=" + encodeURIComponent("/pages/landing/landing")
        };
    },
    getImg: function() {
        var a = this;
        t.fetchWeshineData({
            method: "POST",
            url: e
        }, function(t) {
            if (t.meta && t.meta.status) {
                var e = t.data;
                a.setData({
                    img: e
                });
            }
        });
    },
    imgTap: function() {
        t.aldstat.sendEvent("毕业照 - 落地页 - 点击图片跳转", {}), wx.navigateTo({
            url: "/pages/graduation-photo/entrance/entrance?refer=mp"
        });
    },
    goAlbum: function() {
        t.aldstat.sendEvent("毕业照 - 落地页 - 点击图片跳转到我的相册", {}), wx.navigateTo({
            url: "/pages/graduation-photo/album/album"
        });
    }
});