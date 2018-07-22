var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/wx-promise.js")), a = 750 / wx.getSystemInfoSync().windowWidth / 2, e = getApp();

Page({
    data: {
        moveCount: 0,
        viewCount: 0,
        enableUndo: !1,
        row: 3,
        imageList: [],
        trimedImg: null,
        uploadObj: {
            width: 300 / a,
            height: 300 / a
        },
        canvasId: "jigsawCanvas",
        hideImage: !0,
        emptyUrl: "/resources/img/edit_personal_shape.png"
    },
    onShow: function() {
        var t = this.data;
        t.count = Math.pow(t.row, 2), t.empIndex = t.count - 1;
        var a = e.trimedImg;
        a && (this.getOperationArea(), this.setRandomIndex(), t.trimedImg = a, e.trimedImg = "", 
        this.drawCanvas(), this.setData({
            trimedImg: a
        }));
    },
    getOperationArea: function() {
        for (var t = this.data, a = t.count, e = t.row, n = t.opArea = {}, i = 0; i < a; i++) {
            var s = i - e, r = i - 1, o = i + 1, d = i + e;
            n[i] = {
                t: s >= 0 ? s : null,
                l: r > parseInt(i / e) * e - 1 ? r : null,
                r: o < parseInt(i / e + 1) * e && o || null,
                b: d <= a - 1 && d || null
            };
        }
    },
    setRandomIndex: function() {
        for (var t = this.data, a = t.count, e = t.row, n = [], i = 0; i < a; i++) n.push(i);
        for (var s = a - 1, r = 30 * e, o = t.opArea; r >= 0; ) !function() {
            var t = o[s], a = [ "t", "l", "r", "b" ].filter(function(a, e) {
                return "number" == typeof t[a];
            }), e = parseInt(a.length * Math.random()), i = t[a[e]], d = n[s];
            n[s] = n[i], n[i] = d, s = i, r--;
        }();
        this.setEmptyPosition(n, n.indexOf(a - 1));
    },
    setEmptyPosition: function(t, a) {
        var e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, n = t[e];
        t[e] = t[a], t[a] = n, this.setData({
            rIndex: t,
            curEmpIndex: e
        });
    },
    drawCanvas: function() {
        var t = this, e = this.data, n = wx.createCanvasContext(e.canvasId);
        n.drawImage(e.trimedImg, 0, 0, 300 / a, 300 / a), n.draw(!1, function() {
            t.splitImage(0, 0);
        });
    },
    splitImage: function(e, n) {
        var i = this, s = this.data, r = s.row, o = 300 / a / r, d = s.rIndex, h = e * r + n, c = d.indexOf(h);
        if (h === s.empIndex) return this.replaceDataOnPath([ "imageList", c, "src" ], s.emptyUrl), 
        this.applyDataUpdates(), n < r - 1 ? n++ : (e++, n = 0), void (e !== r && this.splitImage(e, n));
        t.default.canvasToTempFilePath({
            canvasId: s.canvasId,
            quality: 1,
            fileType: "jpg",
            x: n * o,
            y: e * o,
            width: o,
            height: o,
            destWidth: o,
            destHeight: o
        }).then(function(t) {
            i.replaceDataOnPath([ "imageList", c, "src" ], t.tempFilePath), i.applyDataUpdates(), 
            n < r - 1 ? n++ : (e++, n = 0), e !== r && i.splitImage(e, n);
        });
    },
    switchPosition: function(t) {
        var a = t.target.dataset.index, e = this.data, n = e.curEmpIndex, i = e.opArea[n], s = n;
        for (var r in i) if (i[r] === a) {
            s = a;
            break;
        }
        if (s !== n) {
            var o = e.imageList[s];
            this.replaceDataOnPath([ "imageList", n, "src" ], o.src), this.replaceDataOnPath([ "imageList", s, "src" ], e.imageList[n].src), 
            this.replaceDataOnPath([ "rIndex", n ], e.rIndex[s]), this.replaceDataOnPath([ "rIndex", s ], e.rIndex[n]), 
            this.applyDataUpdates();
            var d = ++e.moveCount;
            this.setData({
                moveCount: d,
                enableUndo: !0
            }), this.checkSuccess(), e.curEmpIndex = s, e.preEmptyIndex = n;
        } else console.log("none");
    },
    checkSuccess: function() {
        var t = this;
        this.data.rIndex.some(function(t, a) {
            return t !== a;
        }) || wx.showModal({
            title: "",
            content: "恭喜你，成功完成拼图！",
            confirmText: "再来一局",
            cancelText: "结束",
            success: function(a) {
                a.confirm && t.restartGame();
            }
        });
    },
    restartGame: function() {
        this.setRandomIndex(), this.drawCanvas(), this.setData({
            moveCount: 0,
            viewCount: 0,
            enableUndo: !1
        });
    },
    undoStep: function() {
        if (this.data.enableUndo) {
            var t = this.data, a = t.imageList, e = t.curEmpIndex, n = t.preEmptyIndex, i = t.rIndex;
            this.replaceDataOnPath([ "imageList", e, "src" ], a[n].src), this.replaceDataOnPath([ "imageList", n, "src" ], a[e].src), 
            this.replaceDataOnPath([ "rIndex", e ], i[n]), this.replaceDataOnPath([ "rIndex", n ], i[e]), 
            this.applyDataUpdates(), this.setData({
                curEmpIndex: t.preEmptyIndex,
                enableUndo: !1,
                moveCount: --t.moveCount
            });
        }
    },
    viewImage: function() {
        this.data.trimedImg && this.setData({
            hideImage: !1,
            viewCount: ++this.data.viewCount
        });
    },
    closeImage: function() {
        this.setData({
            hideImage: !0
        });
    }
});