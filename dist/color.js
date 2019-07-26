"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color() {
        this.h = 0;
        this.s = 1;
        this.v = 1;
    }
    Color.prototype.fromHSVValues = function (h, s, v) {
        this.h = Number(h);
        this.s = Number(s);
        this.v = Number(v);
        return this;
    };
    Color.prototype.fromHSV = function (value) {
        return this.fromHSVValues(value.h, value.s, value.v);
    };
    Color.prototype.fromColor = function (value) {
        this.fromHSV(value.toHSV());
        return this;
    };
    Color.prototype.fromRGBValues = function (r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max == 0 ? 0 : d / max;
        if (max == min) {
            h = 0; // achromatic
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                default:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        this.h = h;
        this.s = s;
        this.v = v;
        return this;
    };
    Color.prototype.fromRGB = function (value) {
        return this.fromRGBValues(value.r, value.g, value.b);
    };
    Color.prototype.fromHex = function (hex) {
        var rgb = {};
        rgb.r = parseInt("0x" + hex.substr(1, 2));
        rgb.g = parseInt("0x" + hex.substr(3, 2));
        rgb.b = parseInt("0x" + hex.substr(5, 2));
        this.fromRGB(rgb);
        return this;
    };
    Color.prototype.toHex = function () {
        var rgb = this.toRGB();
        var hex = "#";
        var r = rgb.r.toString(16);
        if (r.length < 2)
            r = "0" + r;
        var g = rgb.g.toString(16);
        if (g.length < 2)
            g = "0" + g;
        var b = rgb.b.toString(16);
        if (b.length < 2)
            b = "0" + b;
        hex += r + g + b;
        return hex;
    };
    Color.prototype.toRGB = function () {
        var r, g, b;
        var h = this.h, s = this.s, v = this.v;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
            default:
                r = v, g = p, b = q;
                break;
        }
        var rgb = {};
        rgb.r = Math.round(r * 255);
        rgb.g = Math.round(g * 255);
        rgb.b = Math.round(b * 255);
        return rgb;
    };
    Color.prototype.toHSV = function () {
        var hsv = {};
        hsv.h = Number(this.h);
        hsv.s = Number(this.s);
        hsv.v = Number(this.v);
        return hsv;
    };
    return Color;
}());
exports.Color = Color;
//# sourceMappingURL=color.js.map