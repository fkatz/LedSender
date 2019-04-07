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
var Effect_1 = require("./Effect");
var RainbowEffect = /** @class */ (function (_super) {
    __extends(RainbowEffect, _super);
    function RainbowEffect(emitter, color) {
        var _this = _super.call(this, emitter) || this;
        _this.func = function () {
            var hsv = _this.color.toHSV();
            hsv.h += _this.step;
            if (hsv.h >= 1) {
                while (hsv.h >= 1) {
                    hsv.h -= 1;
                }
            }
            else if (hsv.h < 0) {
                while (hsv.h < 0) {
                    hsv.h += 1;
                }
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
        if (this.getState())
            this.reset();
    };
    RainbowEffect.prototype.setColor = function (color) {
        this.color = color;
        if (this.getState())
            this.reset();
    };
    RainbowEffect.prototype.get = function () {
        var intState = _super.prototype.get.call(this);
        intState.step = this.step;
        return intState;
    };
    return RainbowEffect;
}(Effect_1.Effect));
exports.RainbowEffect = RainbowEffect;
//# sourceMappingURL=RainbowEffect.js.map