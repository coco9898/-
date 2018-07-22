var e = require("../../../../utils/util.js");

Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function(e) {
                var t = e.width / e.height || 1, a = 88 * t;
                this.setData({
                    wRatioH: t,
                    previewW: a
                });
            }
        },
        type: {
            type: String,
            value: "",
            observer: function(e) {}
        },
        index: {
            type: Number,
            value: ""
        },
        trimed: {
            type: String,
            value: "",
            observer: function(e) {
                this._uploadImage(e);
            }
        },
        uploadUrl: {
            type: String,
            value: "https://imagick.weshine.im/v2.0/upload"
        },
        sizeType: {
            type: Object,
            value: [ "compressed" ]
        },
        previewShow: {
            type: Boolean,
            value: !0,
            observer: function(e) {}
        },
        wrapClass: {
            type: "String",
            value: ".wrap"
        },
        btnText: {
            type: String,
            value: "点击上传"
        },
        options: {
            type: Array,
            value: [ "拍一张照片", "相册选图" ]
        }
    },
    data: {
        icon: "/resources/img/upload.png",
        preview: "",
        wRatioH: 1,
        previewW: 0,
        uploaded: !1
    },
    methods: {
        _chooseImage: function() {
            var t = this, a = this.data.options, i = [ [ "camera" ], [ "album" ] ];
            wx.showActionSheet({
                itemList: a,
                success: function(a) {
                    var o = a.tapIndex, s = i[o];
                    wx.chooseImage({
                        count: 1,
                        sizeType: t.data.sizeType,
                        sourceType: s,
                        success: function(a) {
                            var i = a.tempFilePaths;
                            (0, e.navigateTo)({
                                url: "/pages/img-cropper/img-cropper?wRatioH=" + t.data.wRatioH + "&pic=" + i[0]
                            });
                        }
                    });
                }
            });
        },
        _uploadImage: function(e) {
            var t = this;
            wx.showLoading({
                title: "上传中",
                mask: "true"
            }), wx.uploadFile({
                url: this.data.uploadUrl,
                filePath: e,
                name: "file",
                formData: {},
                success: function(a) {
                    var i = (a = JSON.parse(a.data)).meta || "";
                    if (i.status && 200 == i.status) {
                        var o = a.data.upload_path, s = t.data.item;
                        s.content = o, wx.hideLoading(), t.setData({
                            icon: "/resources/img/onemore@3x.png",
                            preview: e,
                            uploaded: !0
                        }), t.triggerEvent("updatelist", {
                            item: s,
                            index: t.data.index
                        });
                    } else wx.showToast({
                        title: "请重新上传",
                        icon: "none"
                    });
                },
                fail: function() {
                    wx.showToast({
                        title: "请重新上传",
                        icon: "none"
                    });
                }
            });
        }
    }
});