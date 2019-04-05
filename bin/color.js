"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __importStar(require("events"));
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
var ColorState = /** @class */ (function () {
    function ColorState() {
        this.color = new Color();
        this.dim = 1;
        this.emitter = new Events.EventEmitter();
        this.rainbow = new RainbowEffect(this.emitter, this.color);
        this.pulse = new PulseEffect(this.emitter, this);
    }
    ColorState.prototype.getLED = function () {
        var color = this.color.toRGB();
        var r = ((color.r / 255) * 1000 * this.dim).toString();
        var g = ((color.g / 255) * 1000 * this.dim).toString();
        var b = ((color.b / 255) * 1000 * this.dim).toString();
        return r + ":" + g + ":" + b;
    };
    ColorState.prototype.getState = function () {
        return {
            dim: this.dim,
            color: this.color.toHSV(),
            rainbow: this.rainbow.get(),
            pulse: this.pulse.get()
        };
    };
    ColorState.prototype.setState = function (state) {
        if (state.dim != undefined) {
            this.setDim(Number(state.dim));
        }
        if (state.rainbow != undefined) {
            this.setRainbow(state.rainbow);
        }
        if (state.pulse != undefined) {
            this.setPulse(state.pulse);
        }
        if (state.color != undefined) {
            this.setColor(state.color);
        }
    };
    ColorState.prototype.getColor = function () {
        return this.color.toHSV();
    };
    ColorState.prototype.setColor = function (color) {
        if (typeof color.hex != 'undefined') {
            if (color.hex != this.color.toHex()) {
                this.color.fromHex(color.hex);
            }
        }
        else if (typeof color.rgb != 'undefined') {
            var old = this.color.toRGB();
            if (color.rgb[0] != old.r || color.rgb[1] != old.g || color.rgb[2] != old.b) {
                this.color.fromRGBValues(color.rgb[0], color.rgb[1], color.rgb[2]);
            }
        }
        else if (typeof color.hsv != 'undefined') {
            var old = this.color.toHSV();
            color.hsv[0] = color.hsv[0];
            color.hsv[1] = color.hsv[1];
            color.hsv[2] = color.hsv[2];
            if (color.hsv[0] != old.h || color.hsv[1] != old.s || color.hsv[2] != old.v) {
                this.color.fromHSVValues(color.hsv[0], color.hsv[1], color.hsv[2]);
            }
        }
    };
    ColorState.prototype.getDim = function () {
        return this.dim;
    };
    ColorState.prototype.setDim = function (dim) {
        if (dim != this.dim) {
            this.dim = dim;
        }
    };
    ColorState.prototype.getRainbow = function () {
        return this.rainbow.get();
    };
    ColorState.prototype.setRainbow = function (state) {
        console.log(state);
        if (state.state != undefined) {
            this.rainbow.setState(state.state);
        }
        if (state.ms != undefined) {
            this.rainbow.setMs(state.ms);
        }
        if (state.step != undefined) {
            this.rainbow.setStep(state.step);
        }
    };
    ColorState.prototype.getPulse = function () {
        return this.pulse;
    };
    ColorState.prototype.setPulse = function (state) {
        console.log(state);
        if (state.state != undefined) {
            this.pulse.setState(state.state);
        }
        if (state.ms != undefined) {
            this.pulse.setMs(state.ms);
        }
        if (state.step != undefined) {
            this.pulse.setStep(state.step);
        }
    };
    ColorState.getEventNames = function () {
        return [
            "color",
            "dim",
            "rainbow",
            "pulse"
        ];
    };
    ;
    return ColorState;
}());
exports.ColorState = ColorState;
var Effect = /** @class */ (function () {
    function Effect(emitter) {
        this.state = false;
        this.ms = 100;
        this.emitter = emitter;
    }
    Effect.prototype.set = function (func, ms) {
        this.func = func;
        this.ms = ms;
        this.reset();
    };
    Effect.prototype.reset = function () {
        var _this = this;
        if (this.state)
            clearInterval(this.intervalFunc);
        this.intervalFunc = setInterval(function () {
            _this.func();
            for (var _i = 0, _a = Object.entries(_this.events.onEffect); _i < _a.length; _i++) {
                var event = _a[_i];
                _this.emitter.emit(event[0], event[1]());
            }
        }, this.ms);
        this.state = true;
    };
    Effect.prototype.unset = function () {
        clearInterval(this.intervalFunc);
        this.state = false;
    };
    Effect.prototype.setState = function (state) {
        state ? this.reset() : this.unset();
    };
    Effect.prototype.setFunc = function (func) {
        this.func = func;
        this.reset();
    };
    Effect.prototype.setMs = function (ms) {
        this.ms = ms;
        this.reset();
    };
    Effect.prototype.getState = function () {
        return this.state;
        ;
    };
    Effect.prototype.get = function () {
        return {
            state: this.getState(),
            ms: this.ms
        };
    };
    return Effect;
}());
var RainbowEffect = /** @class */ (function (_super) {
    __extends(RainbowEffect, _super);
    function RainbowEffect(emitter, color) {
        var _this = _super.call(this, emitter) || this;
        _this.func = function () {
            var hsv = _this.color.toHSV();
            hsv.h += _this.step;
            while (hsv.h >= 1) {
                hsv.h -= 1;
            }
            _this.color.fromHSV(hsv);
        };
        _this.events = {
            onEffect: { color: function () { return _this.color.toHSV(); } },
            onStateChange: { rainbow: function () { return _this.get(); } }
        };
        _this.step = 0.005;
        _this.color = color;
        return _this;
    }
    RainbowEffect.prototype.setStep = function (step) {
        this.step = step;
        this.reset();
    };
    RainbowEffect.prototype.setColor = function (color) {
        this.color = color;
        this.reset();
    };
    RainbowEffect.prototype.get = function () {
        var intState = _super.prototype.get.call(this);
        intState.step = this.step;
        return intState;
    };
    return RainbowEffect;
}(Effect));
var PulseEffect = /** @class */ (function (_super) {
    __extends(PulseEffect, _super);
    function PulseEffect(emitter, colorState) {
        var _this = _super.call(this, emitter) || this;
        _this.func = function () {
            var radians = Math.asin(2 * _this.colorState.getDim() - 1);
            var dim;
            do {
                radians += _this.step;
                if (radians >= (2 * Math.PI))
                    radians -= 4 * Math.PI;
                dim = (Math.sin(radians) + 1) / 2;
            } while (Math.abs(dim - _this.colorState.getDim()) < 0.1);
            _this.colorState.setDim(dim);
        };
        _this.events = {
            onEffect: { dim: function () { return _this.colorState.getDim(); } },
            onStateChange: { pulse: function () { return _this.get(); } }
        };
        _this.step = 0.05;
        _this.radians = -2 * Math.PI;
        _this.colorState = colorState;
        return _this;
    }
    PulseEffect.prototype.setStep = function (step) {
        this.step = step;
        this.reset();
    };
    PulseEffect.prototype.setColorState = function (colorState) {
        this.colorState = colorState;
        this.reset();
    };
    PulseEffect.prototype.get = function () {
        var intState = _super.prototype.get.call(this);
        intState.step = this.step;
        return intState;
    };
    PulseEffect.prototype.reset = function () {
        this.radians = -2 * Math.PI;
        _super.prototype.reset.call(this);
    };
    return PulseEffect;
}(Effect));
//# sourceMappingURL=color.js.map