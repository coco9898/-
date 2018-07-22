Component({
    options: {
        multipleSlots: !0
    },
    properties: {
        item: {
            type: Object,
            value: null
        },
        index: {
            type: Number,
            value: 0
        }
    },
    ready: function() {
        var e = this.data.item;
        e.collapse = !0, this.setData({
            item: e
        }), wx.createSelectorQuery().in(this).select(".collapse-section-detail").boundingClientRect(function(t) {
            e.height = t.height;
        }).exec(), this.setData({
            item: e
        });
    },
    methods: {
        toggleCollapse: function(e) {
            var t = this.data.item;
            t.collapse = !t.collapse, this.setData({
                item: t
            });
        }
    }
});