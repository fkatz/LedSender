"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LedState_1 = require("./LedState");
var restify = __importStar(require("restify"));
var socket_io_1 = __importDefault(require("socket.io"));
var dgram_1 = __importDefault(require("dgram"));
var client = dgram_1.default.createSocket('udp4');
var devices = {
    ledStrip1: new LedState_1.LedState('192.168.0.6', 2390),
};
/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device', function (req, res, next) {
    res.send(devices[req.params.device].get());
    next();
});
server.post('/api/:device', function (req, res, next) {
    devices[req.params.device].set(req.body);
    res.send({ savedChanges: true });
    next();
});
server.get("/*", restify.plugins.serveStatic({
    directory: __dirname + "/../public/",
    default: 'view.html'
}));
/* SOCKET.IO */
var io = socket_io_1.default.listen(server.server);
io.on("connection", function (socket) {
    console.log("connected");
    for (var _i = 0, _a = Object.entries(devices); _i < _a.length; _i++) {
        var device = _a[_i];
        socket.emit(device[0], JSON.stringify(device[1].get()));
        socket.on(device[0], function (state) {
            device[1].set(JSON.parse(state));
            broadcast(device[1].get(), device[0], socket);
        });
    }
});
function broadcast(state, device, socket) {
    var message = JSON.stringify(state);
    if (socket != undefined) {
        socket.broadcast.emit(device, message);
    }
    else
        io.emit(device, message);
}
var _loop_1 = function (device) {
    setInterval(function () {
        device[1].update();
        broadcast(device[1].get(), device[0]);
        client.send(device[1].getData(), device[1].getPort(), device[1].getIP());
    }, device[1].getRefreshRate());
};
for (var _i = 0, _a = Object.entries(devices); _i < _a.length; _i++) {
    var device = _a[_i];
    _loop_1(device);
}
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
//# sourceMappingURL=main.js.map