function e(e) {
    return function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(o, n) {
            t.success || (t.success = function(e) {
                o(e);
            }), t.fail || (t.fail = function(e) {
                n(e);
            }), e(t);
        });
    };
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = e(wx.showToast), o = e(wx.saveImageToPhotosAlbum), n = e(wx.getSetting), i = e(wx.showModal), r = e(wx.request), a = e(wx.getNetworkType), s = e(wx.login), g = e(wx.getUserInfo), u = e(wx.hideLoading), w = e(wx.uploadFile), f = e(wx.canvasToTempFilePath);

exports.default = {
    getSetting: n,
    showToast: t,
    saveImage: o,
    getImageInfo: function(o) {
        if (wx.getImageInfo) return e(wx.getImageInfo)({
            src: o
        });
        t({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    },
    getFileInfo: function(o) {
        if (wx.getFileInfo) return e(wx.getFileInfo)({
            filePath: o
        });
        t({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    },
    authorize: function(t) {
        return e(wx.authorize)({
            scope: t
        });
    },
    showModal: i,
    previewImage: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
        if ("string" == typeof t && (t = [ t ]), !Array.isArray(t)) throw new Error("传入数组或者字符串");
        return e(wx.previewImage)({
            urls: t,
            current: o
        });
    },
    fetch: r,
    getNetworkType: a,
    login: s,
    getUserInfo: g,
    hideLoading: u,
    canvasToTempFilePath: f,
    uploadFile: w
};