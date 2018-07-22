var t = require("../../../components/share-guide/share-save"), a = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/wx-promise")), e = getApp(), i = !0, n = 156, s = e.servPreURL + "lattice/detail", d = {
    start: "https://dl.weshineapp.com/lattice/_start.png",
    end: "https://dl.weshineapp.com/lattice/_end.png"
};

Page({
    data: {
        id: "",
        uploadObj: {
            height: 100,
            param_id: 11,
            rule: "",
            type: 3,
            width: 100,
            imageHeight: 0,
            imageTop: 0
        },
        example: {
            avatar: "",
            nickName: "",
            content: ""
        },
        trimedImg: "",
        picList: [],
        uploadHistory: {},
        canvasW: 0,
        canvasH: 0,
        tempFilePathArr: []
    },
    initExample: function() {
        var t = this, a = {
            id: this.data.id
        };
        e.fetchWeshineData({
            url: s,
            requestData: a
        }, function(a) {
            if (a.meta.status && 200 == a.meta.status) {
                var e = a.data, i = t.data.example;
                i.content = e.content || "上传一张TA的照片，即可生成朋友圈九宫格密语，点击小图即可预览密语。", i.avatar = e.pic_path || "https://dl.weshineapp.com/gif/20180320/4b2d5b24f13b2ae6637242b2fc5772fb.gif", 
                i.nickName = e.name || "小傻瓜", t.setData({
                    example: i
                });
                var n = e.detail;
                t.betterLayout(n);
            }
        });
    },
    betterLayout: function(t) {
        var a = this;
        wx.getImageInfo({
            src: t[0],
            success: function(e) {
                var i = e.width, s = e.height, d = Math.ceil(n * s / i), r = -(d - n) / 2, o = 9 * n, c = d + n;
                a.setData({
                    imageHeight: d,
                    imageTop: r,
                    picList: t,
                    canvasW: o,
                    canvasH: c
                });
            }
        });
    },
    receiveTrimed: function() {
        var t = this;
        if (!i) {
            var n = e.trimedImg;
            n && (a.default.getFileInfo(n).then(function(a) {
                for (var e = a.digest, i = Object.keys(t.data.uploadHistory), s = i.length, d = 0; d < s; d++) if (i[d] == e) {
                    var r = t.data.uploadHistory[e];
                    return void t.setData({
                        picList: r
                    });
                }
                t.setData({
                    trimedImg: n
                }), t.data.md5 = e;
            }), e.trimedImg = "");
        }
    },
    create: function(t) {
        var a = this, i = t.detail.item.content;
        wx.showLoading({
            title: "生成中",
            mask: !0
        });
        var n = {
            id: this.data.id,
            file_path: i
        };
        e.fetchWeshineData({
            method: "post",
            url: "https://imagick.weshine.im/v2.0/lattice/create",
            requestData: n
        }, function(t) {
            if (t.meta.status && 200 == t.meta.status) {
                var e = t.data;
                wx.hideLoading(), a.setData({
                    picList: e
                });
                var i = a.data.md5;
                i && (a.data.uploadHistory[i] = a.data.picList);
            }
        });
    },
    saveImage: function() {
        e.aldstat.sendEvent("九宫格 - 详情页 - 保存图片", {
            id: this.data.id
        });
        var a = this.data.picList.slice(0);
        a.unshift(d.start), a.push(d.end), wx.showModal({
            title: "确认保存",
            content: "即将保存到相册，按箭头指示依次选择图片即可发布九宫图",
            confirmText: "知道了",
            success: function(e) {
                e.confirm && (0, t.saveImages)(a);
            }
        });
    },
    previewImage: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.picList;
        wx.previewImage({
            current: e[a],
            urls: e
        });
    },
    uploadTap: function() {
        e.aldstat.sendEvent("九宫格 - 详情页 - 上传图片", {
            id: this.data.id
        });
    },
    drawSudoku: function() {
        function a() {
            for (var t = r.data.imageInfoArr, a = t.length, e = 0; e < a; e++) {
                var i = t[e].path, c = n * e;
                o.drawImage(i, c, n, n, r.data.imageHeight), o.drawImage(d, c, 0, n, n);
            }
            o.draw(!1, function() {
                s(0);
            });
        }
        function s(a) {
            var e = a * n;
            wx.canvasToTempFilePath({
                canvasId: "myCanvas",
                x: e,
                y: 0,
                width: n,
                height: r.data.imageHeight,
                success: function(i) {
                    var d = i.tempFilePath;
                    console.log("path:", d, "x", e, "width", n, "height", r.data.imageHeight), r.data.tempFilePathArr.push(d), 
                    ++a < c ? s(a) : (wx.hideLoading(), wx.showModal({
                        title: "保存到本地？",
                        content: "",
                        success: function(a) {
                            a.confirm && (0, t.saveImages)(r.data.tempFilePathArr);
                        }
                    }));
                }
            });
        }
        if (!i) {
            var d = e.trimedImg;
            if (d) {
                var r = this, o = wx.createCanvasContext("myCanvas"), c = this.data.picList.length;
                wx.showLoading({
                    title: "生成中",
                    mask: !0
                });
                for (var h = [], u = 0; u < c; u++) {
                    var m;
                    !function(t) {
                        m = new Promise(function(a, e) {
                            wx.getImageInfo({
                                src: r.data.picList[t],
                                success: function(t) {
                                    a(t);
                                }
                            });
                        }), h.push(m);
                    }(u);
                }
                Promise.all(h).then(function(t) {
                    r.data.imageInfoArr = t, a();
                });
            }
        }
    },
    onLoad: function(t) {
        var a = t.id;
        this.data.id = a, this.initExample();
    },
    onReady: function() {},
    onShow: function() {
        this.receiveTrimed();
    },
    onHide: function() {
        i = !1;
    },
    onShareAppMessage: function() {
        var t = "/pages/sudoku-group/detail/detail?id=" + this.data.id;
        return {
            path: "/pages/index/index?go=" + encodeURIComponent(t),
            title: " "
        };
    }
});