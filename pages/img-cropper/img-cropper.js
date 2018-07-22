var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../utils/we-cropper.js")), e = getApp(), i = wx.getSystemInfoSync().windowWidth, c = i - 40 / (750 / i);

Page({
    data: {
        cropperOpt: {
            id: "cropper",
            width: c,
            height: c,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    },
    onLoad: function(t) {
        this.initCropperOpt(t);
    },
    touchStart: function(t) {
        this.wecropper.touchStart(t);
    },
    touchMove: function(t) {
        this.wecropper.touchMove(t);
    },
    touchEnd: function(t) {
        this.wecropper.touchEnd(t);
    },
    initCropperOpt: function(t) {
        var e = t.wRatioH, i = t.pic;
        this.data.pic = i;
        var o = this.data.cropperOpt;
        1 == e ? (o.cut.width = 4 * c / 5, o.cut.x = (c - o.cut.width) / 2, o.cut.height = 4 * c / 5, 
        o.cut.y = (c - o.cut.height) / 2) : e > 1 ? (o.cut.width = c, o.cut.x = 0, o.cut.height = c / e, 
        o.cut.y = (c - o.cut.height) / 2) : (o.cut.height = c, o.cut.y = 0, o.cut.width = c * e, 
        o.cut.x = (c - o.cut.width) / 2), this.initCropper(this.data.cropperOpt);
    },
    initCropper: function(e) {
        var i = this;
        new t.default(e).on("ready", function(t) {
            i.wecropper.pushOrign(i.data.pic);
        }).on("beforeImageLoad", function(t) {}).on("imageLoad", function(t) {}).on("beforeDraw", function(t, e) {}).updateCanvas();
    },
    getCropperImage: function() {
        this.wecropper.getCropperImage(function(t) {
            t && (e.trimedImg = t, wx.navigateBack({
                delta: 1
            }));
        });
    }
});