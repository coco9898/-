var t = getApp();

Component({
    properties: {
        shareShow: {
            type: Boolean,
            value: !1
        },
        maskImg: {
            type: String,
            value: "",
            observer: function(t, a) {}
        },
        kw: {
            type: String,
            value: ""
        }
    },
    data: {
        timer: 2e3,
        maskShow: !1
    },
    methods: {
        _closeMask: function(t) {
            this.setData({
                maskShow: !1
            }), t && "cancel" == t.currentTarget.dataset.type && this._pingTimeline("cancel");
        },
        _showMask: function() {
            this.setData({
                maskShow: !0
            });
            var t = {}, a = {};
            this.data.maskImg || this.triggerEvent("getcard", t, a), this._pingShare();
        },
        _stopPropagation: function() {},
        _saveImage: function() {
            if (t.isQB) {
                var a = function() {
                    var t = this;
                    wx.qbSaveImage({
                        url: t.data.maskImg,
                        success: function(a) {
                            wx.showToast({
                                title: "动图保存成功",
                                icon: "success",
                                duration: t.data.timer
                            });
                        },
                        fail: function(a) {
                            wx.showToast({
                                title: "动图保存失败",
                                icon: "fail",
                                duration: t.data.timer
                            });
                        }
                    });
                };
                return function() {
                    var t = this;
                    a.apply(t);
                };
            }
            t.system.toLowerCase().indexOf("ios");
            var i = function() {
                var t = this;
                wx.saveImageToPhotosAlbum({
                    filePath: s,
                    success: function(a) {
                        wx.showToast({
                            title: "保存成功",
                            icon: "success",
                            duration: t.data.timer
                        });
                    },
                    fail: function(a) {
                        wx.showToast({
                            title: "保存失败",
                            duration: t.data.timer
                        });
                    }
                });
            }, e = function() {
                var t = this;
                wx.getImageInfo({
                    src: t.data.maskImg,
                    success: function(a) {
                        s = a.path, i.apply(t);
                    },
                    fail: function() {
                        wx.showToast({
                            title: "保存失败",
                            duration: t.data.timer
                        });
                    }
                });
            }, s = "", o = !1;
            return function() {
                var t = this;
                t.setData({
                    maskShow: !1
                }), t._pingTimeline("save"), wx.showToast({
                    icon: "loading",
                    success: function() {
                        wx.saveImageToPhotosAlbum ? wx.getSetting({
                            success: function(a) {
                                o && (a.authSetting = {
                                    "scope.writePhotosAlbum": !1
                                }), a.authSetting["scope.writePhotosAlbum"] ? e.apply(t) : wx.authorize({
                                    scope: "scope.writePhotosAlbum",
                                    success: function() {
                                        o ? (wx.hideToast(), wx.showModal({
                                            title: "小提示",
                                            content: "是否允许闪萌访问你的相册",
                                            confirmText: "允许",
                                            success: function(a) {
                                                a.confirm ? (o = !1, e.apply(t)) : a.cancel && (o = !0);
                                            },
                                            fail: function() {
                                                o = !0;
                                            }
                                        })) : e.apply(t);
                                    },
                                    fail: function() {
                                        o || (o = !0);
                                    }
                                });
                            }
                        }) : wx.showModal({
                            title: "提示",
                            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
                        });
                    },
                    fail: function() {
                        wx.showToast({
                            title: "保存失败，请稍后重试",
                            duration: 2e3
                        });
                    },
                    duration: t.data.timer
                });
            };
        }(),
        _pingShare: function(a) {
            var i = this, e = {
                to: a ? a.currentTarget.dataset.type : "timeline",
                kw: i.data.kw
            };
            t.pingback("shareemojilist.gif", e);
        },
        _pingTimeline: function(a) {
            var i = {
                op: a,
                kw: this.data.kw
            };
            t.pingback("timelinepicsave.gif", i);
        }
    }
});