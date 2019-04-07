"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Effect = /** @class */ (function () {
    function Effect(emitter) {
        this.state = false;
        this.ms = 100;
        this.emitter = emitter;
    }
    Effect.prototype.set = function (func, ms) {
        this.func = func;
        this.ms = ms;
        if (this.getState())
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
        if (this.getState())
            this.reset();
    };
    Effect.prototype.setMs = function (ms) {
        this.ms = ms;
        if (this.getState())
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
exports.Effect = Effect;
//# sourceMappingURL=Effect.js.map