var t = require("../../../utils/util.js"), e = getApp();

Component({
    properties: {
        list: {
            type: Array,
            value: [],
            observer: function(t) {
                t.length % 4 == 0 && this.setData({
                    itemWidth: "25%"
                });
            }
        },
        curPage: {
            type: String,
            value: "首页"
        }
    },
    data: {
        itemWidth: "20%"
    },
    methods: {
        tapBanner: function(a) {
            var i = a.currentTarget.dataset, n = this.data.list[i.index];
            e.pingback("menuclick.gif", {
                menuname: n.name
            }), "h5" !== n.type ? (e.aldstat.sendEvent(this.data.curPage + " - 小icon点击", {
                index: i.index.toString(),
                name: n.name
            }), (0, t.navigate)(n, e.loginData.loginAuth)) : this.triggerEvent("openUrl", {
                url: n.url
            }, {
                bubbles: !0
            });
        }
    }
});