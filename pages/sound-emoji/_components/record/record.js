Component({
    properties: {
        backgroundUrl: {
            type: String,
            value: ""
        },
        totalDuration: {
            type: Number,
            value: 0
        }
    },
    data: {
        state: 0,
        canRecord: !1,
        filepath: null,
        recorderManager: null,
        startTs: null,
        endTs: null,
        timer: null,
        circleLeft: "",
        circleRight: "",
        secondsInterval: null,
        duration: 0
    },
    ready: function() {
        this.startAuthorize();
    },
    methods: {
        startAuthorize: function(t) {
            var e = this;
            wx.getSetting({
                success: function(a) {
                    void 0 === a.authSetting["scope.record"] ? wx.authorize({
                        scope: "scope.record",
                        success: function() {
                            e.setData({
                                canRecord: !0
                            }), t && t();
                        }
                    }) : !1 === a.authSetting["scope.record"] ? wx.openSetting({
                        success: function(a) {
                            e.setData({
                                canRecord: !0
                            }), a.authSetting["scope.record"] && t && t();
                        }
                    }) : (e.setData({
                        canRecord: !0
                    }), t && t());
                }
            });
        },
        startRecord: function(t) {
            var e = this;
            this.triggerEvent("startRecord", t);
            var a = this;
            this.data.startTs = new Date().getTime(), this.setData({
                state: 1
            }), this.data.recorderManager ? this.data.recorderManager.start({
                format: "mp3"
            }) : (this.data.recorderManager = wx.getRecorderManager(), this.data.recorderManager.start({
                format: "mp3"
            }), this.data.recorderManager.onStop(function(t) {
                a.data.endTs - a.data.startTs < 1e3 ? wx.showToast({
                    icon: "none",
                    title: "说话时间太短"
                }) : (a.data.filepath = t.tempFilePath, e.triggerEvent("startUpload", {
                    filepath: t.tempFilePath
                }));
            })), this._secondCount(), this._startCount();
        },
        _secondCount: function() {
            var t = this;
            this.data.secondsInterval = setInterval(function() {
                t.setData({
                    duration: ++t.data.duration
                });
            }, 1e3);
        },
        _startCount: function() {
            function t() {
                a.timer = setTimeout(function() {
                    a._updateProgress(e, a.data.totalDuration > 0 ? 360 / a.data.totalDuration : 150), 
                    e < 150 ? (e++, t()) : a.endRecord();
                }, 100);
            }
            var e = 1, a = this;
            t();
        },
        _updateProgress: function(t) {
            var e = 360 * t / (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 150);
            e > 180 ? this.setData({
                circleLeft: "rotate(" + (e - 180) + "deg)",
                circleRight: "rotate(180deg)"
            }) : this.setData({
                circleLeft: "rotate(0deg)",
                circleRight: "rotate(" + e + "deg)"
            });
        },
        endRecord: function(t) {
            this.triggerEvent("endRecord", t), this.data.endTs = new Date().getTime(), this.setData({
                state: 0
            }), this._stopSecondCount(), this._stopCount(), this.data.recorderManager && this.data.recorderManager.stop();
        },
        _stopCount: function() {
            this.timer && clearTimeout(this.timer), this.setData({
                circleLeft: "rotate(0deg)",
                circleRight: "rotate(0deg)"
            });
        },
        _stopSecondCount: function() {
            clearInterval(this.data.secondsInterval), this.setData({
                duration: 0
            });
        }
    }
});