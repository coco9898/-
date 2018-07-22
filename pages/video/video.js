Page({
    data: {
        video: "",
        backUrl: ""
    },
    onLoad: function(a) {
        this.setData({
            video: decodeURIComponent(a.video) || ""
        }), a.backUrl && this.setData({
            backUrl: decodeURIComponent(a.backUrl) || ""
        });
    },
    videoPlayEnd: function() {
        this.data.backUrl ? wx.redirectTo({
            url: this.data.backUrl
        }) : wx.navigateBack();
    }
});