var t = getApp();

Page({
    data: {
        list: [],
        pageNo: 0,
        pageCount: 10,
        scrollLock: !1
    },
    onLoad: function() {
        this.getList();
    },
    onScrollBottom: function() {
        this.data.scrollLock || (this.data.pageNo++, this.getList());
    },
    getList: function() {
        var a = this;
        t.fetchWeshineData({
            url: t.servPreURL + "subtitle/sublist",
            requestData: {
                offset: this.data.pageNo * this.data.pageCount,
                limit: this.data.pageCount
            }
        }, function(t) {
            200 == t.meta.status && (0 === t.data.length && a.setData({
                scrollLock: !0
            }), a.setData({
                list: a.data.list.concat(t.data)
            }));
        });
    },
    goDetail: function(a) {
        var e = a.currentTarget.dataset.id;
        t.aldstat.sendEvent("字幕组 - 列表页 - 选择模板", {
            id: e
        }), t.pingback("viewsubtitleitem.gif", {
            itemid: e
        }), wx.navigateTo({
            url: "/pages/fansub-group/detail/detail?id=" + e
        });
    }
});