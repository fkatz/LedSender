"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
var PulseEffect_1 = require("./effects/PulseEffect");
var RainbowEffect_1 = require("./effects/RainbowEffect");
var Events = __importStar(require("events"));
var LedState = /** @class */ (function () {
    function LedState() {
        this.color = new color_1.Color();
        this.dim = { value: 1 };
        this.emitter = new Events.EventEmitter();
        this.rainbow = new RainbowEffect_1.RainbowEffect(this.emitter, this.color);
        this.pulse = new PulseEffect_1.PulseEffect(this.emitter, this.dim);
    }
    LedState.prototype.getLED = function () {
        var color = this.color.toRGB();
        var r = ((color.r / 255) * 1000 * this.dim.value).toString();
        var g = ((color.g / 255) * 1000 * this.dim.value).toString();
        var b = ((color.b / 255) * 1000 * this.dim.value).toString();
        return r + ":" + g + ":" + b;
    };
    LedState.prototype.getState = function () {
        return {
            dim: this.dim.value,
            color: this.color.toHSV(),
            rainbow: this.rainbow.get(),
            pulse: this.pulse.get()
        };
    };
    LedState.prototype.setState = function (state) {
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
    LedState.prototype.getColor = function () {
        return this.color.toHSV();
    };
    LedState.prototype.setColor = function (color) {
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
    LedState.prototype.getDim = function () {
        return this.dim.value;
    };
    LedState.prototype.setDim = function (dim) {
        if (dim != this.dim.value && !this.pulse.getState()) {
            this.dim.value = dim;
        }
    };
    LedState.prototype.getRainbow = function () {
        return this.rainbow.get();
    };
    LedState.prototype.setRainbow = function (state) {
        if (state.state != undefined) {
            this.rainbow.setState(Boolean(state.state));
        }
        if (state.ms != undefined) {
            this.rainbow.setMs(Number(state.ms));
        }
        if (state.step != undefined) {
            this.rainbow.setStep(Number(state.step));
        }
    };
    LedState.prototype.getPulse = function () {
        return this.pulse;
    };
    LedState.prototype.setPulse = function (state) {
        if (state.state != undefined) {
            this.pulse.setState(Boolean(state.state));
        }
        if (state.ms != undefined) {
            this.pulse.setMs(Number(state.ms));
        }
        if (state.step != undefined) {
            this.pulse.setStep(Number(state.step));
        }
    };
    LedState.getEventNames = function () {
        return [
            "color",
            "dim",
            "rainbow",
            "pulse"
        ];
    };
    ;
    return LedState;
}());
exports.LedState = LedState;
//# sourceMappingURL=LedState.js.map