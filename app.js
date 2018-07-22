var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./utils/wx-promise.js"));

require("./utils/ald-stat.js");

var t = require("./utils/login.js"), i = require("./utils/request.js"), n = require("./utils/util.js");

App({
    title: "",
    desc: "GIF表情搜索引擎，聊天斗图必备神器",
    servPreURL: "https://mp.weshineapp.com/2.0/",
    system: "",
    isQB: !1,
    copyrightLink: "http://weshineapp.com/clause.html",
    pingParam: {},
    appVersion: "3.4.81",
    appLaunched: !1,
    loginData: {},
    trimedImg: "",
    isNewUser: 0,
    fromWhere: "",
    fetchWeshineData: function(e, t) {
        var n = e.method, a = void 0 === n ? "GET" : n, s = e.url, r = e.requestData, o = void 0 === r ? {} : r, u = e.query, h = void 0 === u ? {} : u;
        return h = Object.assign({
            v: this.appVersion
        }, h), (0, i.fetchWeshineData)({
            method: a,
            url: s,
            requestData: o,
            query: h
        }, t);
    },
    getPingParam: function() {
        var t = wx.getSystemInfoSync(), i = wx.getStorageSync("weshine::uniqid") || "";
        0 === this.isNewUser && (this.isNewUser = i ? 0 : 1);
        var a = (0, n.createUid)();
        return e.default.getNetworkType().then(function(e) {
            var i = "";
            return i = -1 !== e.networkType.toLowerCase().indexOf("wifi") ? 1 : -1 !== e.networkType.toLowerCase().indexOf("4g") ? 2 : 0, 
            {
                s: t.system.split(" ")[0] || "",
                sv: t.system.split(" ")[1] || "",
                v: t.version || "",
                h: a,
                netstatus: i
            };
        });
    },
    pingback: function(e, t) {
        var i = this, n = Math.round(Date.now() / 1e3);
        this.pingParam.t = n;
        var a = "https://ping.weshineapp.com/" + e;
        Object.keys(this.pingParam).forEach(function(e, t) {
            var n = e + "=" + i.pingParam[e];
            a += 0 === t ? "?" + n : "&" + n;
        }), wx.request({
            url: a,
            data: t || {}
        });
    },
    isAuth: function() {
        var e = wx.getStorageSync("weshine::openid");
        return this.openid || (e = wx.getStorageSync("weshine::openid"), this.openid = e), 
        !!e;
    },
    onLaunch: function(e) {
        var i = this, n = "", a = "", s = "";
        e.query && e.query.f && (n = e.query.f, this.fromWhere = n), s = e.path, a = e.scene, 
        this.getPingParam().then(function(r) {
            i.pingParam = r, i.pingParam.f = n, (0, t.initLogin)(i.pingback.bind(i)), i.startLogin = t.startLogin, 
            i.loginData = (0, t.getLoginData)(), (0, t.getLoginData)().getLoginAuth().then(function(e) {
                i.loginData.loginAuth = e;
            }), i.appLaunched = !0, i.pingback("on.gif", {
                new: i.isNewUser,
                path: s,
                subpath: e.query.path || e.query.go || "",
                scene: a
            });
        });
        var r = wx.getSystemInfoSync();
        this.system = r.system, this.isQB = r.isQB;
    },
    onShow: function(e) {
        var t = this;
        this.appLaunched && this.loginData.getLoginAuth().then(function(e) {
            t.loginData.loginAuth = e;
        });
        var i = "", n = "", a = "";
        e.query && e.query.f && (i = e.query.f, this.fromWhere = i), a = e.path, n = e.scene, 
        this.getPingParam().then(function(s) {
            t.pingParam = s, t.pingParam.f = i, t.pingback("show.gif", {
                new: t.isNewUser,
                path: a,
                subpath: e.query.path || e.query.go || "",
                scene: n
            });
        });
    }
});