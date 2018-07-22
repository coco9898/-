function t(t, i) {
    if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var i = function() {
    function t(t, i) {
        for (var h = 0; h < i.length; h++) {
            var s = i[h];
            s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), 
            Object.defineProperty(t, s.key, s);
        }
    }
    return function(i, h, s) {
        return h && t(i.prototype, h), s && t(i, s), i;
    };
}(), h = function() {
    function h(i) {
        var s = i.width, o = i.height, e = i.textX, n = i.textY, a = i.boxLeft, x = i.boxTop, r = i.ratio, u = i.textWidth, f = i.textHeight, d = i.scale;
        t(this, h), this.width = s, this.height = o, this.ratio = r, this.scale = d, this.boxLeft = Math.round(a * r), 
        this.boxRight = (a + s - u) * r, this.boxTop = Math.round(x * r), this.boxBottom = (x + o) * r - f * r, 
        this.init_x = Math.round(e * r), this.init_y = Math.round(n * r), this.delta_x = 0, 
        this.delta_y = 0, this.offsetX = this.init_x - this.boxLeft, this.offsetY = this.init_y - this.boxTop, 
        this.x = "", this.y = "", this.shouldReset = !1;
    }
    return i(h, [ {
        key: "start",
        value: function(t, i, h, s) {
            this.boxRight = this.boxLeft + (this.width - h) * this.ratio, this.boxBottom = this.boxTop + (this.height - s) * this.ratio, 
            this.delta_x = Math.round(t - this.init_x), this.delta_y = Math.round(i - this.init_y);
        }
    }, {
        key: "moving",
        value: function(t, i) {
            this.x = Math.round(t - this.delta_x), this.shouldReset = !1, this.x > this.boxRight ? (this.shouldReset = !0, 
            this.x = this.boxRight) : this.x < this.boxLeft && (this.x = this.boxLeft), this.y = Math.round(i - this.delta_y), 
            this.y > this.boxBottom ? (this.shouldReset = !0, this.y = this.boxBottom) : this.y < this.boxTop && (this.y = this.boxTop), 
            this.offsetX = Math.round(this.x - this.boxLeft), this.offsetY = Math.round(this.y - this.boxTop);
        }
    }, {
        key: "end",
        value: function() {
            "" !== this.x && "" !== this.y && (this.init_x = this.x, this.init_y = this.y);
        }
    } ]), h;
}();

exports.default = h;