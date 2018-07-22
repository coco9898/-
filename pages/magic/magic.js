var t = require("../../utils/util.js"), a = require("../../components/share-guide/share-save.js"), i = getApp();

Page({
    data: {
        magicAPI: i.servPreURL + "text2img/create",
        defaultPicAPI: i.servPreURL + "text2img/getimage",
        magicSrc: "",
        magicId: "",
        opt: "",
        timer: 2e3,
        finished: !1,
        progress: "0%",
        status: "loading",
        inputValue: "",
        tipShow: !1,
        defaultPic: "",
        inputFocus: !0
    },
    onReady: function() {
        try {
            this.shareComponent = this.selectComponent("#share-component");
        } catch (t) {}
    },
    emptyError: function() {
        var a = this;
        (0, t.showErrorModel)("请输入要合成的文字").then(function() {
            a.setData({
                inputFocus: !0
            });
        });
    },
    shareImage: function() {
        if (this.data.opt.kw) {
            this.pingbackMagic("share.gif");
            try {
                this.shareComponent.share();
            } catch (t) {
                (0, a.wxShare)(this.data.imgSrc);
            }
        } else this.emptyError();
    },
    saveImage: function() {
        if (this.data.opt.kw) {
            this.pingbackMagic("save.gif");
            try {
                this.shareComponent.save();
            } catch (t) {
                (0, a.wxShare)(this.data.imgSrc);
            }
        } else this.emptyError();
    },
    onemore: function() {
        var t = this;
        this.data.opt.kw ? t.data.finished && (t.setData({
            finished: !1,
            magicSrc: "",
            status: "loading"
        }), t.progressGo(), t.getMagicData(t.data.opt)) : this.emptyError();
    },
    progressGo: function() {
        var t = this, a = 0, i = setInterval(function() {
            a >= 96 ? a = 96 : a += 2, t.setData({
                progress: a + "%"
            }), t.data.finished && (clearInterval(i), t.setData({
                progress: "100%"
            }), setTimeout(function() {
                t.setData({
                    progress: "0%"
                });
            }, 300));
        }, 100);
    },
    getMagicData: function(t) {
        var a = this, e = {
            text: t.kw || " "
        };
        i.fetchWeshineData({
            url: a.data.magicAPI + '?thumb=""',
            requestData: e,
            method: "POST"
        }, function(t) {
            if (200 == t.meta.status) {
                var e = t.data.img || "";
                -1 != e.indexOf("http://") && (e = "https://" + e.split("http://")[1]), a.setData({
                    magicSrc: e || "",
                    magicId: t.data.id,
                    finished: !0,
                    status: ""
                });
                var s = {
                    content: a.data.opt.kw || "",
                    picid: a.data.magicId
                };
                i.pingback("createmagic.gif", s);
            }
        });
    },
    pingbackMagic: function(t) {
        var a = this, e = {
            picid: a.data.magicId || "",
            refer: "magic",
            kw: a.data.opt.kw || ""
        };
        i.pingback(t, e);
    },
    getDefaultPic: function() {
        var t = this;
        i.fetchWeshineData({
            url: this.data.defaultPicAPI
        }, function(a) {
            if (a.meta.status && 200 == a.meta.status) {
                var i = a.data;
                t.setData({
                    defaultPic: i.url_1 || "https://dl.weshineapp.com/misc/godpictures.gif"
                });
            }
        });
    },
    onLoad: function(t) {
        this.setData({
            opt: t
        }), t.kw ? (this.getMagicData(t), this.progressGo()) : (this.getDefaultPic(), this.setData({
            finished: !0,
            status: ""
        }));
    },
    onShareAppMessage: function() {
        return {
            title: i.title,
            desc: i.desc,
            path: "/pages/index/index?path=magic&kw=" + this.data.opt.kw
        };
    },
    setValue: function(t) {
        this.setData({
            inputValue: t.detail.value
        });
    },
    confirm: function() {
        var t = this.data.inputValue;
        t ? this.data.finished && (this.setData({
            finished: !1,
            magicSrc: "",
            status: "loading"
        }), this.progressGo(), this.getMagicData({
            kw: t
        }), this.setData({
            opt: Object.assign(this.data.opt, {
                kw: t
            })
        })) : this.emptyError();
    }
});