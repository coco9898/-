function e(e) {
    return decodeURIComponent(e.replace(/\+/g, " "));
}

var n = Object.prototype.hasOwnProperty;

exports.stringify = function(e, r) {
    var o = [];
    "string" != typeof (r = r || "") && (r = "?");
    for (var t in e) n.call(e, t) && o.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
    return o.length ? r + o.join("&") : "";
}, exports.parse = function(n) {
    for (var r, o = /([^=?&]+)=?([^&]*)/g, t = {}; r = o.exec(n); t[e(r[1])] = e(r[2])) ;
    return t;
};