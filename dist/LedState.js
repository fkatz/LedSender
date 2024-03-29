"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
var PulseEffect_1 = require("./effects/PulseEffect");
var RainbowEffect_1 = require("./effects/RainbowEffect");
var AudioEffect_1 = require("./effects/AudioEffect");
var LedState = /** @class */ (function () {
    function LedState(ip, port, refreshRate) {
        this.color = new color_1.Color();
        this.refreshRate = 60;
        this.effects = {
            rainbow: new RainbowEffect_1.RainbowEffect(this.color),
            pulse: new PulseEffect_1.PulseEffect(),
            audio: new AudioEffect_1.AudioEffect(8081)
        };
        if (refreshRate != undefined)
            this.refreshRate = refreshRate;
        this.ip = ip;
        this.port = port;
    }
    LedState.prototype.getData = function () {
        var color = this.color.toRGB();
        var dim = Object.values(this.effects)
            .filter(function (effect) { return effect.getDim != undefined; })
            .map(function (effect) { return effect.getDim(); })
            .reduce(function (acum, dim) { return acum * dim; });
        var r = ((color.r / 255) * 1000 * dim).toString();
        var g = ((color.g / 255) * 1000 * dim).toString();
        var b = ((color.b / 255) * 1000 * dim).toString();
        return r + ":" + g + ":" + b;
    };
    LedState.prototype.getIP = function () {
        return this.ip;
    };
    LedState.prototype.getPort = function () {
        return this.port;
    };
    LedState.prototype.getRefreshRate = function () {
        return this.refreshRate;
    };
    LedState.prototype.get = function () {
        var state = {
            color: this.color.toHSV(),
            ip: this.ip,
            refreshRate: this.refreshRate
        };
        for (var _i = 0, _a = Object.entries(this.effects); _i < _a.length; _i++) {
            var effect = _a[_i];
            state[effect[0]] = effect[1].get();
        }
        return state;
    };
    LedState.prototype.set = function (state) {
        if (state.ip != undefined) {
            this.ip = state.ip;
        }
        if (state.refreshRate != undefined) {
            this.refreshRate = state.refreshRate;
        }
        if (state.color != undefined) {
            this.setColor(state.color);
        }
        for (var _i = 0, _a = Object.entries(this.effects); _i < _a.length; _i++) {
            var effect = _a[_i];
            if (state[effect[0]] != undefined) {
                effect[1].set(state[effect[0]]);
            }
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
    LedState.prototype.update = function () {
        for (var _i = 0, _a = Object.values(this.effects); _i < _a.length; _i++) {
            var effect = _a[_i];
            effect.doEffect();
        }
    };
    return LedState;
}());
exports.LedState = LedState;
//# sourceMappingURL=LedState.js.map