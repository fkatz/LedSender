"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgram_1 = __importDefault(require("dgram"));
var AudioDevice = /** @class */ (function () {
    function AudioDevice(port) {
        var _this = this;
        this.audioValues = [];
        this.client = dgram_1.default.createSocket('udp4');
        this.client.bind(port);
        this.client.on('listening', function () {
            var addr = _this.client.address();
            console.log("Listening for UDP packets at port " + addr.port);
        });
        this.client.on('error', function (err) {
            console.error("UDP error: " + err.stack);
        });
        this.client.on('message', function (msg, rinfo) {
            _this.audioValues = [];
            for (var i = 0; i < Buffer.byteLength(msg) / 8; i++) {
                _this.audioValues[i] = msg.readDoubleLE(i * 8);
            }
        });
    }
    AudioDevice.prototype.getSpectrum = function () {
        return this.audioValues;
    };
    return AudioDevice;
}());
exports.AudioDevice = AudioDevice;
//# sourceMappingURL=AudioDevice.js.map