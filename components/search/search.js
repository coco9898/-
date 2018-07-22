var t = getApp(), e = t.servPreURL + "wx/template";

Component({
    properties: {
        hotWord: {
            type: String,
            value: "",
            observer: function(t) {
                t && (this.referHotword = !0, this.setData({
                    searchValue: t
                }));
            }
        },
        prepend: {
            type: Boolean,
            value: !1
        },
        append: {
            type: Boolean,
            value: !1
        },
        noSugg: {
            type: Boolean,
            value: !1
        },
        pagePath: {
            type: String,
            value: ""
        },
        openType: {
            type: String,
            value: "redirect"
        },
        searchValue: {
            type: String,
            value: ""
        },
        searchFocus: {
            type: Boolean,
            value: !1
        },
        placeholder: {
            type: String,
            value: "搜索你想要的表情包"
        },
        suggAPI: {
            type: String,
            value: "sugg"
        },
        searchHistoryKey: {
            type: String,
            value: "searchHistory"
        },
        targetPage: {
            type: String,
            value: "pages/list/list"
        }
    },
    data: {
        hidesugg: !0,
        hideEmptyResult: !0,
        history: [],
        hideHistory: !0,
        hideMask: !0,
        pageWord: {}
    },
    created: function() {
        this.firstFocus = !0;
    },
    ready: function() {
        var t = void 0;
        try {
            t = wx.getStorageSync(this.data.searchHistoryKey);
        } catch (t) {}
        t || (t = []), this.setData({
            history: t
        });
    },
    methods: {
        showHistory: function() {
            this.data.history.length && !this.data.searchValue && this.setData({
                hideHistory: !1,
                hideMask: !1
            });
        },
        holdFocus: function(t) {
            this.firstFocus && (this.data.hotWord && this.setData({
                searchValue: "",
                hotWord: ""
            }), this.referHotword = !1, this.firstFocus = !1);
            var e = this.data.searchValue;
            e && !this.data.noSugg && this.getSugg(e), this.showHistory();
        },
        inputHandler: function(t) {
            var e = t.detail.value;
            this.setData({
                searchValue: e,
                hideHistory: !0
            }), 0 === t.detail.value.length && this.setData({
                hidesugg: !0
            }), e && !this.data.noSugg && this.getSugg(t.detail.value);
        },
        getSugg: function(e) {
            var a = this, i = {
                kw: e,
                limit: 30
            }, r = t.servPreURL + this.data.suggAPI;
            t.fetchWeshineData({
                url: r,
                requestData: i
            }).then(function(t) {
                var e = !0, i = !0, r = [], s = {};
                if (t.data && t.data.length > 0) {
                    e = !1;
                    var h = t.data;
                    h[0].through && 1 == h[0].through ? (r = h.slice(1), s = h[0]) : r = h;
                } else i = !1;
                a.setData({
                    sugg: r,
                    hidesugg: e,
                    hideEmptyResult: i,
                    hideMask: !1,
                    pageWord: s
                });
            });
        },
        clearSearch: function() {
            this.setData({
                hidesugg: !0,
                hideEmptyResult: !0,
                hideMask: !0,
                hideHistory: !0,
                searchValue: ""
            });
        },
        trigger: function() {
            this.triggerEvent("submit", {
                value: this.data.searchValue,
                referHotword: this.referHotword
            }, {
                bubbles: !0
            }), this.clearSearch();
        },
        searchBtnSubmit: function(t) {
            var e = this.data.searchValue;
            if (e) {
                var a = t.detail.formId;
                this.report(e, a), this.setHistoryStorage(e), this.trigger();
            }
        },
        confirm: function() {
            var t = this.data.searchValue;
            t && (this.setHistoryStorage(t), this.trigger(), this.data.pagePath && wx.redirectTo({
                url: "/" + this.data.targetPage + "?refer=input&kw=" + t
            }));
        },
        goHome: function() {
            t.pingback("backhome.gif", {
                refer: "homelink",
                page: this.data.pagePath
            });
        },
        report: function(a, i) {
            var r = void 0;
            try {
                r = wx.getStorageSync("weshine::openid");
            } catch (t) {
                throw new Error("search getStorage openid failed " + t);
            }
            var s = {
                form_id: i,
                openid: r,
                kw: a,
                type: 1
            };
            r && t.fetchWeshineData({
                url: e,
                requestData: s,
                method: "POST"
            });
        },
        reportSubmit: function(t) {
            var e = t.detail.target.dataset.name || this.data.searchValue;
            if (e) {
                var a = t.detail.formId;
                this.report(e, a), this.setHistoryStorage(e), this.clearSearch();
            }
        },
        setHistoryStorage: function(t) {
            if (!this.data.noSugg) {
                var e = this.data.history;
                e.unshift(t), (e = Array.from(new Set(e))).length > 5 && e.pop();
                try {
                    wx.setStorageSync(this.data.searchHistoryKey, e);
                } catch (t) {}
                this.setData({
                    history: e
                });
            }
        },
        clearHistory: function() {
            this.setData({
                hideMask: !0,
                history: [],
                hideHistory: !0
            }), wx.removeStorageSync(this.data.searchHistoryKey);
        },
        hideAllList: function() {
            this.setData({
                hideEmptyResult: !0,
                hideHistory: !0,
                hidesugg: !0,
                hideMask: !0
            });
        }
    }
});