Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function(t) {}
        },
        type: {
            type: String,
            value: ""
        },
        index: {
            type: Number,
            value: ""
        }
    },
    attached: function() {
        if (this.data.item && !this.data.item.content) {
            this.data.item.content = this.data.item.select[this.data.tapIndex];
            var t = this.data.index, e = this.data.item;
            this.triggerEvent("updatelist", {
                index: t,
                item: e
            });
        }
    },
    data: {
        tapIndex: 0
    },
    methods: {
        _select: function() {
            var t = this, e = t.data.item.select;
            wx.showActionSheet({
                itemList: e,
                success: function(a) {
                    var i = a.tapIndex;
                    i != t.data.tapIndex && t.setData({
                        tapIndex: i
                    }), t.data.item.content = e[i];
                    var n = t.data.item, d = t.data.index;
                    t.triggerEvent("updatelist", {
                        index: d,
                        item: n
                    });
                }
            });
        },
        _pickerChange: function(t) {
            var e = t.detail.value, a = this.data.item.select;
            this.setData({
                tapIndex: e
            }), this.data.item.content = a[e];
            var i = this.data.item, n = this.data.index;
            this.triggerEvent("updatelist", {
                index: n,
                item: i
            });
        },
        _inputChange: function(t) {
            var e = t.detail.value;
            this.data.item.content = e;
            var a = this.data.item, i = this.data.index;
            this.triggerEvent("updatelist", {
                index: i,
                item: a
            });
        }
    }
});