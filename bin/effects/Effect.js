"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Effect = /** @class */ (function () {
    function Effect() {
        this.state = false;
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
        }
    };
    return Effect;
}());
exports.Effect = Effect;
//# sourceMappingURL=Effect.js.map