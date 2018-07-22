var t = getApp(), e = t.servPreURL + "groupphoto/getgraduationinfo";

Page({
    data: {
        shareTextAPI: t.servPreURL + "groupphoto/sharetext",
        openid: "",
        photo_id: "",
        nickname: "",
        shareImage: "",
        lack_num: -1,
        membersList: [],
        shareText: ""
    },
    onLoad: function(t) {
        var e = t.photo_id, a = t.nickname, r = t.share_image, i = wx.getStorageSync("weshine::openid") || "", o = decodeURIComponent(r) || "";
        this.setData({
            openid: i,
            photo_id: e,
            nickname: a,
            shareImage: o
        }), this.getList(), this.getShareText();
    },
    onShareAppMessage: function() {
        t.pingback("photo_share.gif", {
            f: t.fromWhere
        });
        var e = this.formatShareText();
        return t.aldstat.sendEvent("毕业照 - 已加入成员列表页 - 邀请好友", {
            f: t.fromWhere
        }), {
            title: e || this.data.nickname + "最大的遗憾，就是没有跟你拍过一张这样的合照",
            imageUrl: "",
            path: "/pages/graduation-photo/processing/processing?photo_id=" + this.data.photo_id + "&f=" + t.fromWhere
        };
    },
    getList: function() {
        var a = this, r = this.data, i = {
            openid: r.openid,
            photo_id: r.photo_id
        };
        t.fetchWeshineData({
            method: "POST",
            url: e,
            requestData: i
        }, function(t) {
            if (t.meta && 200 == t.meta.status) {
                var e = t.data, r = e.seatArr, i = e.lack_num, o = r.filter(function(t) {
                    return t.uid && t.figure_url;
                });
                a.setData({
                    membersList: o,
                    lack_num: +i
                });
            }
        });
    },
    getShareText: function() {
        var e = this;
        t.fetchWeshineData({
            url: this.data.shareTextAPI
        }, function(t) {
            if (t.meta && 200 == t.meta.status) {
                var a = t.data.share_text;
                e.setData({
                    shareText: a
                });
            }
        });
    },
    formatShareText: function() {
        var t = /[^\{\}]+(?=\})/g, e = this.data.shareText, a = e.match(t);
        if (!a) return "";
        for (var r = a.length, i = 0; i < r; i++) {
            var o = a[i], n = this.data[o];
            if (!n) return "";
            e = e.replace("{" + o + "}", n);
        }
        return e;
    }
});