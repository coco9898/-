var t = require("../../utils/util.js");

Component({
    properties: {
        list: {
            type: Object,
            value: []
        },
        kw: {
            type: String,
            value: "",
            observer: function(t) {}
        }
    },
    methods: {
        _pkgTap: function(e) {
            var a = e.currentTarget.dataset.item;
            this.data.url = "/pages/list-emopkg/list-emopkg?kw=" + a.name + "&id=" + a.id + "&searchword=" + this.data.kw, 
            (0, t.navigateTo)({
                url: this.data.url
            });
        }
    }
});