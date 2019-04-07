"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Effect = /** @class */ (function () {
    function Effect(emitter) {
        this.state = false;
        this.emitter = emitter;
    }
    Effect.prototype.set = function (state) {
        if (state.state != undefined) {
            this.setState(Boolean(state.state));
        }
    };
    Effect.prototype.setState = function (state) {
        this.state = state;
    };
    Effect.prototype.getState = function () {
        return this.state;
    };
    Effect.prototype.get = function () {
        return {
            state: this.state
        };
    };
    Effect.prototype.doEffect = function () {
        if (this.state) {
            this.func();
            for (var _i = 0, _a = Object.entries(this.events.onEffect); _i < _a.length; _i++) {
                var event = _a[_i];
                this.emitter.emit(event[0], event[1]());
            }
        }
    };
    return Effect;
}());
exports.Effect = Effect;
//# sourceMappingURL=Effect.js.map