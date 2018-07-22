function r(r) {
    return r && r.__esModule ? r : {
        default: r
    };
}

function e(r) {
    if ("string" != typeof r) throw new Error("invalid url");
    var e = "", n = "";
    return r.startsWith("http") ? (n = r.split("?")[0], e = r.split("?")[1]) : e = r.trim().replace(/^[?#&]/, ""), 
    {
        url: n,
        query: t(e)
    };
}

function t(r) {
    var e = Object.create(null);
    if (!r) return e;
    var t = !0, n = !1, i = void 0;
    try {
        for (var a, u = r.split("&")[Symbol.iterator](); !(t = (a = u.next()).done); t = !0) {
            var l = a.value.split("="), c = o(l, 2), s = c[0], f = c[1];
            e[s] = f;
        }
    } catch (r) {
        n = !0, i = r;
    } finally {
        try {
            !t && u.return && u.return();
        } finally {
            if (n) throw i;
        }
    }
    return e;
}

function n(r, e) {
    return -1 === r.indexOf("?") && (r += "?"), Object.keys(e).forEach(function(t) {
        r += t + "=" + e[t] + "&";
    }), r.slice(0, -1);
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.fetchWeshineData = exports.formatUrl = void 0;

var o = function() {
    function r(r, e) {
        var t = [], n = !0, o = !1, i = void 0;
        try {
            for (var a, u = r[Symbol.iterator](); !(n = (a = u.next()).done) && (t.push(a.value), 
            !e || t.length !== e); n = !0) ;
        } catch (r) {
            o = !0, i = r;
        } finally {
            try {
                !n && u.return && u.return();
            } finally {
                if (o) throw i;
            }
        }
        return t;
    }
    return function(e, t) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return r(e, t);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), i = r(require("./md5.js")), a = require("./util.js"), u = r(require("./wx-promise.js")), l = exports.formatUrl = function(r) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (!r) throw new Error("no url");
    var o = Math.round(Date.now() / 1e3), u = i.default.md5("weshine@2016#Y2MyZTlmYmUxMWY5MjJkODE1ODE4NzgzNDNmZWI3NDM=#" + o), l = (0, 
    a.createUid)(), c = e(r), s = c.url, f = c.query;
    return t = Object.assign({
        timestamp: o,
        sign: u,
        h: l
    }, f, t), r = n(s, t);
}, c = function(r, e, t, n) {
    return {
        url: e = l(e, n),
        method: r = r.toUpperCase(),
        header: "POST" === r ? {
            "Content-Type": "application/x-www-form-urlencoded"
        } : {
            "Content-Type": "application/json"
        },
        data: t
    };
}, s = function(r, e) {
    var t = r.data;
    if (t.meta && 200 == +t.meta.status) {
        try {
            "function" == typeof e && e(t);
        } catch (r) {
            (0, a.showErrorModel)("请求错误"), console.error("回调函数错误", r);
        }
        return t;
    }
    var n = t.message || "请求错误";
    return 10003 == +t.code && (n = "您好，由于您手机时间不是当前的北京时间，会导致小程序使用出现问题。请在手机-设置内，校准您的手机时间即可。"), 
    (0, a.showErrorModel)(n), {
        errMsg: n
    };
}, f = function(r, e) {
    var t = r.data;
    try {
        "function" == typeof e && e(t);
    } catch (r) {
        (0, a.showErrorModel)("请求错误"), console.error("回调函数错误", r, e);
    }
    return t;
}, d = "";

exports.fetchWeshineData = function(r, e) {
    var t = r.method, n = void 0 === t ? "GET" : t, o = r.url, i = r.requestData, l = void 0 === i ? {} : i, h = r.query, p = c(n, o, l, void 0 === h ? {} : h);
    return u.default.fetch(p).then(function(r) {
        if ("POST" === p.method) return f(r, e);
        if ("GET" === p.method) {
            var t = s(r, e);
            return t.data || console.log(p), t;
        }
        if ("request:ok" !== r.errMsg) throw new Error("接口错误");
    }).catch(function(r) {
        return console.log("err", r, o, l), d || (0, a.showErrorModel)("加载失败，请点击重试").then(function() {
            wx.reLaunch({
                url: "/pages/index/index"
            }), d = !0;
        }), Promise.reject(r);
    });
};