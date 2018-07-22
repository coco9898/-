var t = require("./share-save.js"), o = wx.getSystemInfoSync().system.toLowerCase().indexOf("ios") >= 0;

Component({
    properties: {
        imgSrc: {
            type: String,
            value: ""
        }
    },
    data: {
        _guideShow: !1
    },
    methods: {
        _showPreview: function() {
            var o = this;
            (0, t.wxShare)(this.data.imgSrc).then(function() {
                wx.setNavigationBarColor({
                    frontColor: "#000000",
                    backgroundColor: "#ffda44"
                }), o.setData({
                    _guideShow: !1
                });
            });
        },
        _showCountLT1: function() {
            var t = wx.getStorageSync("guideShowCount");
            if (t) return !1;
            t = 1;
            try {
                wx.setStorageSync("guideShowCount", t);
            } catch (t) {
                throw new Error("guideShowCount set storage error" + t);
            }
            return !0;
        },
        _checkIsGif: function() {
            return this.data.imgSrc.toLowerCase().indexOf(".gif") > -1;
        },
        share: function() {
            wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#000"
            }), this._showCountLT1() ? this.setData({
                _guideShow: !0
            }) : this._showPreview();
        },
        save: function() {
            return o && this._checkIsGif() ? (this.share(), Promise.resolve(!0)) : (wx.showLoading({
                title: ""
            }), (0, t.andriodSave)(this.data.imgSrc).then(function(t) {
                return wx.hideLoading(), t.success && wx.showToast({
                    title: "保存成功"
                }), t;
            }).catch(function(t) {
                wx.hideLoading(), "goSetting" !== t && wx.showToast({
                    title: t.msg
                });
            }));
        }
    }
});