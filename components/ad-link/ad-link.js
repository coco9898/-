var e = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r]);
    }
    return e;
}, t = require("../../utils/util.js"), a = getApp();

Component({
    properties: {
        list: {
            type: Object,
            value: {}
        },
        refer: {
            type: String,
            value: ""
        }
    },
    data: {
        webUrl: ""
    },
    methods: {
        _getNavgateType: function(t) {
            return t.appId ? e({}, t, {
                type: "app"
            }) : t.path ? e({}, t, {
                type: "page"
            }) : t.url ? e({}, t, {
                type: "h5"
            }) : t;
        },
        _adLinkTap: function() {
            var e = this._getNavgateType(this.data.list), r = e.type;
            "app" === r ? a.pingback("adclick.gif", {
                adid: e.appId,
                refer: this.data.refer
            }) : "page" === r ? a.pingback("adclick.gif", {
                adid: e.path,
                refer: this.data.refer
            }) : "h5" === r && (a.pingback("adclick.gif", {
                adid: e.url,
                refer: this.data.refer
            }), this.setData({
                webUrl: e.url
            })), (0, t.navigate)(e, !0);
        }
    }
});