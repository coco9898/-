var t = require("../../../utils/util"), a = getApp();

Page({
    data: {
        listAPI: a.servPreURL + "synthesis/synlist",
        list: [],
        pageNo: 0,
        pageCount: 10,
        scrollLock: !1,
        title: "闪萌表情",
        type: 1
    },
    onShareAppMessage: function(t) {
        var a = "/pages/universal-make/list/list?title=" + this.data.title + "&type=" + this.data.type;
        return {
            path: "/pages/index/index?go=" + encodeURIComponent(a),
            title: ""
        };
    },
    onLoad: function(t) {
        this.setData({
            title: t.title || "DIY合成",
            type: t.type || 1
        }), wx.setNavigationBarTitle({
            title: this.data.title
        }), this.getList();
    },
    onReachBottom: function() {
        this.onScrollBottom();
    },
    onScrollBottom: function() {
        this.data.scrollLock || (this.data.pageNo++, this.getList());
    },
    getList: function() {
        var t = this, e = this.data.type || 1;
        a.fetchWeshineData({
            url: t.data.listAPI,
            requestData: {
                offset: this.data.pageNo * this.data.pageCount,
                limit: this.data.pageCount,
                type: e
            }
        }, function(a) {
            200 == a.meta.status && (0 === a.data.length && t.setData({
                scrollLock: !0
            }), t.setData({
                list: t.data.list.concat(a.data)
            }));
        });
    },
    goDetail: function(e) {
        var i = e.currentTarget.dataset.id + "";
        a.aldstat.sendEvent("通用合成 - 列表页 - 选择模板", {
            id: i
        }), (0, t.navigateTo)({
            url: "/pages/universal-make/detail/detail?id=" + i
        });
    }
});