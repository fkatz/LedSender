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
var PulseEffect = /** @class */ (function (_super) {
    __extends(PulseEffect, _super);
    function PulseEffect(emitter, dim) {
        var _this = _super.call(this, emitter) || this;
        _this.func = function () {
            var dim = _this.minValue + (1 - _this.minValue) * (Math.cos(_this.radians) + 1) / 2;
            _this.radians += _this.step;
            if (_this.radians >= 2 * Math.PI) {
                _this.radians -= 4 * Math.PI;
            }
            else if (_this.radians <= -2 * Math.PI) {
                _this.radians += 4 * Math.PI;
            }
            _this.dim.value = dim;
        };
        _this.events = {
            onEffect: { dim: function () { return _this.dim.value; } },
            onStateChange: { pulse: function () { return _this.get(); } }
        };
        _this.step = 0.05;
        _this.radians = -2 * Math.PI;
        _this.minValue = 0.2;
        _this.dim = dim;
        return _this;
    }
    PulseEffect.prototype.setStep = function (step) {
        this.step = step;
        if (this.getState())
            this.reset();
    };
    PulseEffect.prototype.setDim = function (dim) {
        this.dim = dim;
        if (this.getState())
            this.reset();
    };
    PulseEffect.prototype.setMinValue = function (minValue) {
        this.minValue = minValue;
        if (this.getState())
            this.reset();
    };
    PulseEffect.prototype.get = function () {
        var intState = _super.prototype.get.call(this);
        intState.step = this.step;
        intState.minValue = this.minValue;
        return intState;
    };
    PulseEffect.prototype.reset = function () {
        this.radians = Math.acos(2 * (this.dim.value - this.minValue) / (1 - this.minValue) - 1);
        _super.prototype.reset.call(this);
    };
    return PulseEffect;
}(Effect_1.Effect));
exports.PulseEffect = PulseEffect;
//# sourceMappingURL=PulseEffect.js.map