function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function t() {
    wx.showModal({
        title: "",
        content: "此功能需要授权后才可使用",
        confirmText: "前往授权",
        cancelText: "取消",
        success: function(e) {
            e.confirm && wx.openSetting({});
        }
    });
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.startLogin = exports.getLoginData = exports.initLogin = void 0;

var n = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
}, r = function() {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
            Object.defineProperty(e, r.key, r);
        }
    }
    return function(t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
    };
}(), o = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./wx-promise.js")), i = require("./request.js"), s = function() {
    return o.default.getSetting().then(function(e) {
        return e.authSetting["scope.userInfo"];
    });
}, u = function() {
    function t() {
        e(this, t), this.jscode = "", this.userinfo = "", this.rdsession = "", this.openid = "", 
        this.sysAuthShowed = 0, this.authorized = "", this.loginAuth = "";
    }
    return r(t, [ {
        key: "getLoginAuth",
        value: function() {
            var e = this;
            return s().then(function(t) {
                var n = void 0;
                try {
                    n = wx.getStorageSync("weshine::openid");
                } catch (e) {}
                var r = t && !!n;
                return e.loginAuth = r, r;
            });
        }
    }, {
        key: "wxLogin",
        value: function() {
            var e = this;
            return new Promise(function(t, n) {
                o.default.login().then(function(n) {
                    e.jscode = n.code, t(n);
                });
            });
        }
    }, {
        key: "getUserInfo",
        value: function() {
            var e = this, n = this;
            return new Promise(function(r, i) {
                o.default.getUserInfo({
                    complete: function() {
                        wx.getStorage({
                            key: "ws:sysAuthShowed",
                            success: function(e) {},
                            fail: function() {
                                try {
                                    wx.setStorageSync("ws:sysAuthShowed", "1");
                                } catch (e) {}
                                t.pingback("authorize_show.gif");
                            }
                        }), n.getLoginAuth().then(function(e) {
                            n.loginAuth = e;
                        });
                    }
                }).then(function(n) {
                    console.log("getuserinfo succ"), e.userinfo = n;
                    var o = 0;
                    try {
                        o = wx.getStorageSync("ws:authorized");
                    } catch (e) {
                        console.error("get authorized error");
                    }
                    if (!o) {
                        try {
                            wx.setStorageSync("ws:authorized", 1);
                        } catch (e) {
                            console.error("set authorized error");
                        }
                        t.pingback("authorize_confirm");
                    }
                    e.authorized = o, r(n);
                }).catch(function(e) {
                    i(e);
                });
            });
        }
    }, {
        key: "checkLogin",
        value: function() {
            var e = this;
            if (!this.userinfo) return Promise.reject("没有授权");
            var t = {
                jscode: this.jscode,
                iv: this.userinfo.iv,
                rdsession: this.rdsession,
                encryptedData: this.userinfo.encryptedData
            };
            return (0, i.fetchWeshineData)({
                url: "https://mp.weshineapp.com/2.0/wx/checklogin",
                requestData: t,
                method: "post"
            }).then(function(t) {
                return e.rdsession = t.data.rdsession, wx.setStorage({
                    key: "weshine::rdsession",
                    data: t.data.rdsession
                }), Promise.resolve(e.rdsession);
            });
        }
    }, {
        key: "initOpenid",
        value: function() {
            var e = this, t = {
                rdsession: this.rdsession
            };
            return (0, i.fetchWeshineData)({
                url: "https://mp.weshineapp.com/2.0/wx/userinfos",
                requestData: t,
                method: "post"
            }).then(function(t) {
                var n = t.openid;
                if (n) {
                    e.openid = n;
                    try {
                        wx.setStorageSync("weshine::openid", n);
                    } catch (e) {
                        console.error("set openid error", e);
                    }
                    return e.loginAuth = !0, Promise.resolve(n);
                }
            });
        }
    } ], [ {
        key: "getInstance",
        value: function(e) {
            return t.instance || (t.instance = new t(e), t.pingback = e), t.instance;
        }
    } ]), t;
}();

exports.initLogin = function(e) {
    u.getInstance(e);
}, exports.getLoginData = function() {
    return u.getInstance();
}, exports.startLogin = function() {
    var e = u.getInstance();
    return s().then(function(r) {
        if (!1 === r) return t(), Promise.reject("login failed: showErrorModal");
        if (e.openid) {
            try {
                wx.setStorageSync("weshine::openid", e.openid);
            } catch (e) {}
            return n({}, e, {
                loginAuth: !0
            });
        }
        return e.wxLogin().then(function() {
            return wx.showLoading(), e.getUserInfo();
        }).then(function(e) {
            return e;
        }).then(function() {
            return e.checkLogin();
        }).then(function(t) {
            return e.initOpenid();
        }).then(function(t) {
            return wx.hideLoading(), e;
        }).catch(function(e) {
            return wx.hideLoading(), e;
        });
    });
};