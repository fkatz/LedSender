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
Object.defineProperty(exports, "__esModule", { value: true });
var Effect_1 = require("../effects/Effect");
var AudioDevice_1 = require("../AudioDevice");
var AudioEffect = /** @class */ (function (_super) {
    __extends(AudioEffect, _super);
    function AudioEffect(port) {
        var _this = _super.call(this) || this;
        _this.func = function () {
            if (_this.audioDevice.getSpectrum()[_this.freq] != undefined) {
                _this.dim = _this.minValue + _this.audioDevice.getSpectrum()[_this.freq] * (1 - _this.minValue);
            }
        };
        _this.minValue = 0;
        _this.dim = 1;
        _this.freq = 0;
        _this.audioDevice = new AudioDevice_1.AudioDevice(port);
        return _this;
    }
    AudioEffect.prototype.set = function (state) {
        _super.prototype.set.call(this, state);
        if (state.freq != undefined) {
            this.setFreq(Number(state.freq));
        }
        if (state.minValue != undefined) {
            this.setMinValue(Number(state.minValue));
        }
    };
    AudioEffect.prototype.getDim = function () {
        return this.state ? this.dim : 1;
    };
    AudioEffect.prototype.setFreq = function (freq) {
        this.freq = freq;
    };
    AudioEffect.prototype.setMinValue = function (minValue) {
        if (minValue < 1) {
            this.minValue = minValue;
        }
    };
    AudioEffect.prototype.get = function () {
        var intState = _super.prototype.get.call(this);
        intState.freq = this.freq;
        intState.minValue = this.minValue;
        intState.spectrum = this.audioDevice.getSpectrum();
        intState.dim = this.dim;
        return intState;
    };
    return AudioEffect;
}(Effect_1.Effect));
exports.AudioEffect = AudioEffect;
//# sourceMappingURL=AudioEffect.js.map