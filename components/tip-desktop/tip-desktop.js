var t = getApp().system.toLowerCase().indexOf("ios") >= 0;

Component({
    properties: {
        show: {
            type: Boolean,
            value: !1,
            observer: function(s) {
                !t && s && this.setData({
                    mask: !0
                });
            }
        }
    },
    data: {
        mask: !1
    },
    methods: {
        _closeMask: function() {
            this.setData({
                mask: !1
            });
        },
        _stopPropagation: function() {}
    }
});