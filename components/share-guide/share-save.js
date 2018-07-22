function e(e) {
    return s.default.saveImage({
        filePath: e
    }).then(function(e) {
        return {
            success: !0,
            msg: "保存成功"
        };
    }).catch(function(e) {
        return Promise.reject(e);
    });
}

function t(t) {
    return s.default.getImageInfo(t).then(function(t) {
        return "getImageInfo:ok" === t.errMsg ? e(t.path) : Promise.reject({
            success: !1,
            msg: "getImageInfoFailed"
        });
    });
}

function n() {
    return s.default.getSetting().then(function(e) {
        return !1 === e.authSetting["scope.writePhotosAlbum"] ? (wx.showModal({
            title: "授权通知",
            content: "为了保证图片能够正常保存，您需要开启您的相册访问权限",
            confirmText: "现在开启",
            showCancel: !0,
            success: function(e) {
                e.confirm && wx.openSetting({});
            }
        }), {
            success: !1,
            msg: "去开启权限"
        }) : Promise.reject({
            success: !1,
            msg: "保存失败,请稍候重试"
        });
    });
}

function r(e) {
    return t(e).then(function(e) {
        return {
            success: !0,
            msg: "保存成功"
        };
    }).catch(function(e) {
        return "saveImageToPhotosAlbum:fail cancel" === e.errMsg ? Promise.reject({
            success: !1,
            msg: "已取消"
        }) : n();
    });
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.wxShare = function(e) {
    return s.default.previewImage(e);
}, exports.andriodSave = r, exports.saveImages = function(e) {
    var t = this;
    if (!Array.isArray(e)) throw new Error("list must be Array");
    var n = e.length, o = 1;
    (e = e.map(function(e) {
        return r.bind(t, e);
    })).reduce(function(e, t) {
        return e.then(function() {
            return wx.showLoading({
                title: "正在保存" + o + "/" + n + "张"
            }), t().then(function(e) {
                return e.success ? (wx.showLoading({
                    title: "正在保存" + o++ + "/" + n + "张"
                }), e) : Promise.reject(e);
            });
        });
    }, Promise.resolve()).then(function(e) {
        s.default.hideLoading().then(function() {
            e.success && wx.showToast({
                title: "保存成功"
            });
        });
    }).catch(function(e) {
        s.default.hideLoading().then(function() {
            "去开启权限" !== e.msg && wx.showToast({
                title: e.msg || "保存失败"
            });
        });
    });
};

var s = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../utils/wx-promise.js"));