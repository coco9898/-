var t = require("../../../utils/util"), a = getApp(), e = a.servPreURL + "voicehome";

Page({
    data: {
        iconList: [],
        worksList: []
    },
    onLoad: function(t) {
        this.getIconList();
    },
    onShareAppMessage: function() {},
    getIconList: function() {
        var t = this;
        a.fetchWeshineData({
            url: e
        }, function(a) {
            if (a.meta && 200 == a.meta.status) {
                var e = a.data;
                t.setData({
                    iconList: e
                });
            }
        });
    },
    goList: function(a) {
        var e = a.currentTarget.dataset.id;
        (0, t.navigateTo)({
            url: "/pages/sound-emoji/list/list?id=" + e
        });
    },
    goDetail: function(a) {
        var e = a.currentTarget.dataset.id;
        (0, t.navigateTo)({
            url: "/pages/sound-emoji/share/share?type=start&id=" + e
        });
    }
});