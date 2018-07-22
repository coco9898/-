Component({
    properties: {
        step: {
            type: String,
            value: "",
            observer: function(t) {
                t ? this._checkShowed(t) : this.setData({
                    show: ""
                });
            }
        }
    },
    data: {
        show: "",
        guideHistory: []
    },
    methods: {
        _checkShowed: function(t) {
            var e = wx.getStorageSync("once_guide_step_history") || [];
            this.data.guideHistory = e;
            for (var s = e.length, o = 0; o < s; o++) if (e[o] == t) return;
            this.setData({
                show: t
            });
        },
        _closeGuide: function(t) {
            var e = this.data, s = e.guideHistory, o = e.show;
            o && (s.push(o), wx.setStorageSync("once_guide_step_history", s)), t.k = this.data.step, 
            this.triggerEvent("closeModal", t);
        }
    }
});