var t = require("../../../utils/util"), e = getApp(), o = e.servPreURL + "groupphoto/photolist";

Page({
    data: {
        status: {
            havePhoto: !1,
            noPhoto: !1
        },
        photoList: [],
        openid: ""
    },
    getAlbum: function() {
        var t = this, a = this.data.openid;
        e.fetchWeshineData({
            method: "POST",
            url: o,
            requestData: {
                openid: a
            }
        }, function(e) {
            if (e.meta && 200 == e.meta.status) {
                var o = e.data;
                if (o.length) (a = t.data.status).havePhoto = !0, a.noPhoto = !1, t.setData({
                    status: a,
                    photoList: o
                }); else {
                    var a = t.data.status;
                    a.noPhoto = !0, a.havePhoto = !1, t.setData({
                        status: a
                    });
                }
            }
        });
    },
    photoTap: function(o) {
        var a = o.currentTarget.dataset.id;
        e.aldstat.sendEvent("毕业照 - 相册页 - 点击相片", {
            content: a
        }), (0, t.navigateTo)({
            url: "../processing/processing?photo_id=" + a + "&refer=list"
        });
    },
    create: function() {
        e.aldstat.sendEvent("毕业照 - 相册页 - 创建按钮", {}), (0, t.navigateTo)({
            url: "../entrance/entrance?refer=list"
        });
    },
    onLoad: function() {},
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("weshine::openid") || "";
        if (t) this.data.openid = t, this.getAlbum(); else {
            var e = this.data.status;
            e.noPhoto = !0, e.havePhoto = !1, this.setData({
                status: e
            });
        }
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: " ",
            path: "/pages/index/index?go=/pages/graduation-photo/album/album&f=" + e.fromWhere
        };
    }
});