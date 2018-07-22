var t = require("../../../utils/util"), a = getApp(), e = a.servPreURL + "lattice/latlist";

Page({
    data: {
        listAPI: a.servPreURL + "/synthesis/synlist",
        list: [],
        pageNo: 0,
        pageCount: 10,
        scrollLock: !1,
        title: "闪萌表情"
    },
    onShareAppMessage: function(t) {
        var a = "/pages/sudoku-group/list/list?title=" + this.data.title;
        return {
            path: "/pages/index/index?go=" + encodeURIComponent(a),
            title: " "
        };
    },
    onLoad: function(t) {
        this.setData({
            title: t.title || "九宫格密语"
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
        var t = this;
        a.fetchWeshineData({
            url: e,
            requestData: {
                offset: this.data.pageNo * this.data.pageCount,
                limit: this.data.pageCount
            }
        }, function(a) {
            a.meta.status && 200 == a.meta.status && (0 === a.data.length && t.setData({
                scrollLock: !0
            }), t.setData({
                list: t.data.list.concat(a.data)
            }));
        });
    },
    goDetail: function(e) {
        var i = e.currentTarget.dataset.id, s = e.currentTarget.dataset.title;
        a.aldstat.sendEvent("九宫格 - 列表页 - 选择模板", {
            id: i,
            title: s
        }), (0, t.navigateTo)({
            url: "/pages/sudoku-group/detail/detail?id=" + i
        });
    }
});