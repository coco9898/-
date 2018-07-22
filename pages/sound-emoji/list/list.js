var t = require("../../../utils/util.js"), a = getApp(), s = a.servPreURL + "emojis";

Page({
    data: {
        id: "",
        worksListCache: [],
        worksList: [],
        lastIdx: 10
    },
    onLoad: function(t) {
        var a = t.id;
        this.setData({
            id: a
        }), this.getList();
    },
    onReachBottom: function() {
        this.loadMore();
    },
    getList: function() {
        var t = this, i = s, e = this.data, o = e.id, r = e.lastIdx, d = {
            id: o
        };
        a.fetchWeshineData({
            url: i,
            requestData: d
        }, function(a) {
            if (a.meta && a.meta.status) {
                var s = a.data;
                t.setData({
                    worksListCache: s,
                    worksList: s.slice(0, r)
                });
            }
        });
    },
    loadMore: function() {
        var t = this.data, a = t.lastIdx, s = t.worksListCache;
        a < s.length && (a += 10, this.setData({
            lastIdx: a,
            worksList: s.slice(0, a)
        }));
    },
    goDetail: function(a) {
        var s = a.currentTarget.dataset.id;
        (0, t.navigateTo)({
            url: "/pages/sound-emoji/detail/detail?type=start&id=" + s
        });
    }
});