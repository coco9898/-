Component({
    properties: {
        swipeList: {
            type: Object,
            value: []
        },
        active: {
            type: Boolean,
            value: !1
        },
        indicatorDots: {
            type: Boolean,
            value: !0
        },
        interval: {
            type: Number,
            value: 4e3
        },
        duration: {
            type: Number,
            value: 1e3
        },
        autoplay: {
            type: Boolean,
            value: !0
        },
        circular: {
            type: Boolean,
            value: !0
        },
        indicatorColor: {
            type: String,
            value: "rgba(255,255,255,0.50)"
        },
        indicatorActiveColor: {
            type: String,
            value: "#fff"
        }
    },
    methods: {
        closeModal: function(e) {
            this.triggerEvent("closeGuideModal", e);
        }
    }
});