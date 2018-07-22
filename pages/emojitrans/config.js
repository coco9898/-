Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = "https://mp.weshineapp.com/2.0/";

exports.default = [ {
    name: "Emoji翻译",
    placeholder: "输入一段话，我会把它翻译成 emoji ~",
    api: e + "emojitranslate",
    inputLengthValidate: !0,
    dataKey: "code",
    cardApi: e + "emojishare"
}, {
    name: "乱码文字翻译",
    placeholder: "输入一段话，我会把它翻译成乱码文字~",
    api: e + "gibberishtext",
    inputLengthValidate: !0,
    dataKey: "mixStr",
    cardApi: "https://imagick.weshine.im/v2.0/gibberishcard"
} ];