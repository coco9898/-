Component({
    properties: {
        music: {
            type: String,
            value: "",
            observer: function(t) {
                this._initBgMusic(t);
            }
        },
        position: {
            type: String,
            value: "right: 20rpx; top: 20rpx;"
        },
        rotate: {
            type: Boolean,
            value: !0
        },
        audioOn: {
            type: String,
            value: "/resources/img/music-play.png"
        },
        audioOff: {
            type: String,
            value: "/resources/img/music-pause.png"
        }
    },
    data: {
        icon: "",
        audioStatus: 1,
        audioCtx: "",
        musicClass: "music-on"
    },
    detached: function() {
        this.onHide();
    },
    ready: function() {
        this.setData({
            icon: this.data.audioOn
        });
    },
    methods: {
        onShow: function() {
            this.data.music && this.data.audioStatus && this.data.audioCtx.play();
        },
        onHide: function() {
            this.data.music && this.data.audioStatus && this.data.audioCtx.pause(), this.setData({
                animationData: {}
            });
        },
        _initBgMusic: function(t) {
            if (this.data.audioCtx && this.data.audioCtx.destroy(), t) {
                var a = wx.createInnerAudioContext();
                this.setData({
                    audioCtx: a
                }), "1" == this.data.audioStatus && (a.autoplay = !0), a.loop = !0, a.src = t;
            }
        },
        _handleAudio: function() {
            this.data.audioStatus ? (this.setData({
                audioStatus: 0,
                icon: this.data.audioOff,
                musicClass: ""
            }), this.data.audioCtx.pause()) : (this.setData({
                audioStatus: 1,
                icon: this.data.audioOn,
                musicClass: "music-on"
            }), this.data.audioCtx.play());
        }
    }
});