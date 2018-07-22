var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function() {
    function o(t) {
        var o = wx.getStorageSync("t_uuid");
        return o ? S.ifo = !1 : (o = "" + Date.now() + Math.floor(1e7 * Math.random()), 
        wx.setStorageSync("t_uuid", o), wx.setStorageSync("ifo", 1), S.ifo = !0), o;
    }
    function e(t, e, n) {
        var i = o(t), a = 0;
        if ("app" == e && "hide" == n) {
            var s = Date.now();
            a = wx.getStorageSync("ifo"), wx.setStorageSync("ifo", 0);
        }
        var p = "";
        p = "user_info" == e ? t.aldpush_login_data : "user_info_close" == e ? {
            status: 0
        } : "event" == e ? g : "yyy" == e ? g : 0;
        var r = "fpage" == e || "fhpage" == e ? S.fid : 0, u = "page" == e || "app" == e || "fpage" == e || "fhpage" == e ? 0 : S.jscode, f = {
            v: w,
            uu: i,
            ev: e,
            life: n,
            ak: y.app_key.replace(/(^\s*)|(\s*$)/g, ""),
            pm: S.pm ? S.pm : 0,
            wvv: S.wvv ? S.wvv : 0,
            wsdk: S.wsdk ? S.wsdk : 0,
            sv: S.sv ? S.sv : 0,
            wv: S.wv ? S.wv : 0,
            nt: S.nt ? S.nt : 0,
            ww: S.ww ? S.ww : 0,
            wh: S.wh ? S.wh : 0,
            pr: S.pr ? S.pr : 0,
            pp: S.pp ? S.pp : 0,
            lat: S.lat ? S.lat : 0,
            lng: S.lng ? S.lng : 0,
            st: S.st || 0,
            et: s || 0,
            ppx: S.ppx ? S.ppx : 0,
            ppy: S.ppy ? S.ppy : 0,
            data: p || 0,
            fid: r,
            lang: S.lang ? S.lang : 0,
            wsr: "app" == e ? t.aldpush_showOptions : {},
            ifo: a,
            jscode: u || 0,
            ust: Date.now()
        };
        t.aldpush_openid && (f.openid = t.aldpush_openid), "" === _ || "event" !== e && "yyy" !== e || (f.etype = _), 
        "yyy" === e && "postevent" === n ? wx.request({
            url: "https://openapi.xiaoshentui.com/Main/action/Event/Event_upload/mobile_info",
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            data: f,
            success: function(t) {}
        }) : "yyy" === e && m ? wx.request({
            url: "https://openapi.xiaoshentui.com/Main/action/Event/Event_upload/event_report",
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            data: f,
            success: function(t) {}
        }) : D(f, "GET", "d.html");
    }
    function n(t) {
        this.app = t;
    }
    function i(t) {
        this.aldpush = new n(this);
        var o = this;
        void 0 !== t ? (o.aldpush_showOptions = t, v = t.path, S.pp = t.path) : o.aldpush_showOptions = {};
        wx.getNetworkType({
            success: function(t) {
                S.nt = t.networkType;
            }
        }), b(o), wx.getSystemInfo({
            success: function(t) {
                S.pm = t.model, S.wv = t.version, S.wsdk = void 0 === t.SDKVersion ? "1.0.0" : t.SDKVersion, 
                S.sv = t.system, S.wvv = t.platform, S.ww = t.screenWidth, S.wh = t.screenHeight, 
                S.pr = t.pixelRatio, S.lang = t.language;
            }
        }), wx.getSystemInfoSync({
            success: function(t) {
                S.wvv = t.platform;
            }
        }), "devtools" == S.wvv && j();
    }
    function a(t) {
        var o = this;
        o.isShow = !0, y.is_sendEvent && l(o), o.aldpush_showOptions = void 0 !== t ? t : {}, 
        S.st = Date.now();
    }
    function s() {
        var t = this;
        t.isShow = !1, e(t, "app", "hide"), x = 0;
    }
    function p(t) {
        var o = this;
        void 0 !== t && (o.options = t), "default" != v && v != o.__route__ && M(o, function(t) {
            o.aldpush_login_data = t, e(o, "user_info", "userinfo");
        });
    }
    function r(t) {
        var o = this;
        void 0 !== t && (o.options = t), S.pp = o.__route__, v = o.__route__, e(getApp(), "page", "hide");
    }
    function u(t, o) {
        for (var e = S.ww, n = S.wh, i = this, a = {
            length: [],
            is_showHideBtn: !1
        }, s = 0; s <= 50; s++) {
            var p = '-webkit-transform: scale(0.5);transform:scale(1);content:"";height:88px;width:88px;border:1px solid transparent;background-color:transparent;position:fixed;z-index: 999;left:' + Math.ceil(Math.random() * e) + "px;top:" + Math.ceil(Math.random() * n) + "px;";
            a.length.push(p);
        }
        var r = wx.getStorageSync("isShowClick");
        i.setData({
            hideBtnData: a,
            isShowClick: Boolean(r)
        });
    }
    function f(t) {
        function o() {
            wx.setStorageSync("isShowClick", "false"), n.setData({
                is_showHideBtn: !0,
                isShowClick: "false"
            });
        }
        var n = this;
        S.ppx = t.detail.target.offsetLeft, S.ppy = t.detail.target.offsetTop, S.fid = t.detail.formId, 
        M(n, function(t) {
            n.aldpush_login_data = t, e(n, "user_info", "userinfo"), o();
        }), y.is_Location && k(n), e(n, "fpage", "clickform");
    }
    function c(t) {
        var o = this;
        S.ppx = t.detail.target.offsetLeft, S.ppy = t.detail.target.offsetTop, S.fid = t.detail.formId, 
        o.setData({
            is_showHideBtn: !0
        }), e(o, "fhpage", "hideclickform");
    }
    function d(t, o) {
        var n = "", i = arguments, a = this;
        if (t || (t = i), t) {
            var s = [ "onLoad", "onReady", "onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage", "onPageScroll" ];
            _ = void 0 === t.type ? void 0 === t.from ? s.indexOf(o) >= 0 ? "wechat_function" : "developer_function" : t.from : t.type, 
            n = void 0 !== i[0] ? i[0] : {}, g = n, y.filterFunc.indexOf(o) >= 0 || e(a, "event", o), 
            m && e(a, "yyy", o);
        }
    }
    function l(t) {
        wx.onAccelerometerChange(function(o) {
            t.isShow && o.x > 1 && o.y > 1 && (x += 1) >= 3 && (m = !0, e(t, "yyy", "postevent"));
        });
    }
    function h(t, o, e) {
        if (t[o]) {
            var n = t[o];
            t[o] = function(t) {
                return e.call(this, t, o), n.call.apply(n, [ this ].concat(Array.prototype.slice.call(arguments)));
            };
        } else t[o] = function(t) {
            e.call(this, t, o);
        };
    }
    var w = "2.7", v = "default", y = require("./push-stat-conf.js"), g = {}, _ = "", m = !1, x = 0, S = {
        uu: "",
        ak: "",
        pm: "",
        wvv: "",
        wsdk: "",
        sv: "",
        wv: "",
        nt: "",
        ww: "",
        wh: "",
        pr: "",
        pp: "",
        lat: "",
        lng: "",
        ev: "",
        st: "",
        et: "",
        ppx: "",
        ppy: "",
        v: "",
        data: "",
        fid: "",
        lang: "",
        wsr: "",
        ifo: "",
        jscode: "",
        etype: ""
    };
    Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
        if (null == this) throw new TypeError();
        var o = Object(this), e = o.length >>> 0;
        if (0 === e) return -1;
        var n = 0;
        if (arguments.length > 1 && ((n = Number(arguments[1])) != n ? n = 0 : 0 != n && n != 1 / 0 && n != -1 / 0 && (n = (n > 0 || -1) * Math.floor(Math.abs(n)))), 
        n >= e) return -1;
        for (var i = n >= 0 ? n : Math.max(e - Math.abs(n), 0); i < e; i++) if (i in o && o[i] === t) return i;
        return -1;
    });
    var k = function(t) {
        wx.getLocation({
            type: "wgs84",
            success: function(o) {
                S.lat = o.latitude, S.lng = o.longitude, e(t, "location", "location");
            },
            fail: function() {}
        });
    }, b = function(t) {
        wx.getSetting({
            success: function(o) {
                o.authSetting["scope.userLocation"] && k(t), o.authSetting["scope.userInfo"] && M(t, function(o) {
                    t.aldpush_login_data = o, e(t, "user_info", "userinfo");
                });
            }
        });
    }, M = function(t, o) {
        if (!y.is_getUserinfo) return !1;
        wx.login({
            success: function(t) {
                t.code ? (S.jscode = t.code, wx.getUserInfo({
                    success: function(t) {
                        o(t);
                    },
                    fail: function(t) {
                        e(t, "user_info_close", "user_info_close");
                    }
                })) : S.jscode = 0;
            }
        });
    }, D = function(t, o, e) {
        void 0 === arguments[1] && (o = "GET"), void 0 === arguments[2] && (e = "d.html");
        var n = 0;
        !function i() {
            wx.request({
                url: "https://plog.xiaoshentui.com/" + e,
                data: t,
                header: {},
                method: o,
                success: function() {},
                fail: function() {
                    n < 2 && (n++, t.retryTimes = n, i());
                }
            });
        }();
    }, j = function() {
        wx.request({
            url: "https://plog.xiaoshentui.com/config/app.json",
            header: {
                AldStat: "MiniApp-Stat"
            },
            method: "GET",
            success: function(t) {
                200 === t.statusCode && t.data.push_v != w && console.warn("小神推sdk已更新,为不影响正常使用,请去官网(http://www.xiaoshentui.com/)下载最新版本");
            }
        });
    };
    n.prototype.pushuserinfo = function(o, n) {
        if ("object" === (void 0 === o ? "undefined" : t(o))) {
            var i = [ "encryptedData", "errMsg", "iv", "rawData", "signature", "userInfo" ];
            for (var a in o) if (i.indexOf(a) < 0) return;
            this.app.aldpush_login_data = o, "string" == typeof n && (S.jscode = n), e(this.app, "user_info", "userinfo");
        }
    }, n.prototype.setopenid = function(t) {
        "string" == typeof t && (this.app.aldpush_openid = t, e(this.app, "setopenid", "setopenid"));
    };
    var O = App;
    App = function(t) {
        h(t, "onLaunch", i), h(t, "onShow", a), h(t, "onHide", s), O(t);
    };
    var T = Page;
    Page = function(t) {
        for (var o in t) if ("function" == typeof t[o]) {
            if ("onLoad" == o) {
                h(t, "onLoad", u);
                continue;
            }
            if ("onHide" == o) {
                h(t, "onHide", r);
                continue;
            }
            h(t, o, d);
        }
        h(t, "onShow", p), h(t, "hidepushFormSubmit", c), h(t, "pushFormSubmit", f), T(t);
    };
}();