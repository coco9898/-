function e(e, t) {
    var n = 0, r = e.length;
    return e.reduce(function(e, o) {
        return e.then(function() {
            return o().then(function(e) {
                return "function" == typeof t && t(e, n++, r), e;
            });
        });
    }, Promise.resolve());
}

function t(e) {
    var t = e.url, n = e.success, r = e.fail, o = e.complete;
    getCurrentPages().length < 8 ? wx.navigateTo({
        url: t,
        success: n,
        fail: r,
        complete: o
    }) : (t = "/pages/index/index?go=" + encodeURIComponent(t), wx.reLaunch({
        url: t,
        success: n,
        fail: r,
        complete: o
    }));
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.createUid = void 0, exports.navigate = function(e, n) {
    "page" === e.type ? t({
        url: e.path
    }) : "app" === e.type && (wx.navigateToMiniProgram ? wx.navigateToMiniProgram({
        appId: e.appid || e.appId,
        path: e.path
    }) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    }));
}, exports.promiseQueue = e, exports.getImagesInfo = function(t, r) {
    var o = [];
    return t.forEach(function(e, t) {
        o.push(function() {
            return n.default.getImageInfo(e).then(function(e) {
                return r(e, t), e;
            });
        });
    }), e(o);
}, exports.navigateTo = t, exports.showErrorModel = function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
    return n.default.showModal({
        title: "",
        content: e || "",
        showCancel: !1,
        confirmText: "知道了"
    });
};

var n = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./wx-promise.js"));

exports.createUid = function() {
    var e = "";
    try {
        e = wx.getStorageSync("weshine::uniqid");
    } catch (e) {}
    if (e) return e;
    e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
        var t = 16 * Math.random() | 0;
        return ("x" === e ? t : 3 & t | 8).toString(16);
    });
    try {
        wx.setStorageSync("weshine::uniqid", e);
    } catch (e) {}
    return e;
};