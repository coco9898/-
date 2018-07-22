Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function(t) {
                if (t.font_screen) {
                    var e = t.font_screen.length || 20, n = "int" == t.font_screen.font_type ? "number" : "text";
                    this.setData({
                        maxLength: e,
                        inputType: n
                    });
                }
                t.content && this.setData({
                    placeholder: t.content
                });
            }
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
    data: {
        placeholder: "",
        maxLength: 20,
        inputType: "text",
        inputValueLen: 0
    },
    methods: {
        _inputWord: function(t) {
            var e = t.detail.value;
            this.setData({
                inputValueLen: e.length || 0
            }), this.data.item.content = e || this.data.placeholder;
            var n = this.data.item;
            this.triggerEvent("updatelist", {
                index: this.data.index,
                item: n
            });
        }
    }
});