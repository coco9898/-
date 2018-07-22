var t = require("../../../utils/util.js"), e = getApp();

Component({
    properties: {
        list: {
            type: Array,
            value: [],
            observer: function(t) {
                this.setData({
                    listWidth: 270 * t.length + 15 + "rpx"
                });
            }
        }
    },
    data: {
        bannerUrls: []
    },
    methods: {
        tapBanner: function(n) {
            var i = n.currentTarget.dataset, a = this.data.list[i.index], r = a.type;
            if ("page" === r) e.pingback("viewcolumn.gif", {
                columnid: a.path
            }), e.aldstat.sendEvent("首页 - 小banner点击", {
                index: i.index.toString(),
                to: a.path.replace(/(\/|\?|\=)/g, "_")
            }); else if ("app" === r) e.pingback("viewcolumn.gif", {
                columnid: a.appId
            }), e.aldstat.sendEvent("首页 - 小banner点击", {
                index: i.index.toString(),
                to: a.appId
            }); else if ("h5" === r) return e.pingback("viewcolumn.gif", {
                columnid: a.url
            }), this.triggerEvent("openUrl", {
                url: a.url
            }, {
                bubbles: !0
            }), void e.aldstat.sendEvent("首页 - 小banner点击", {
                index: i.index.toString(),
                to: a.url
            });
            (0, t.navigate)(a, e.loginData.loginAuth);
        }
    }
});