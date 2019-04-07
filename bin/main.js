"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var LedState = __importStar(require("./LedState"));
var restify = __importStar(require("restify"));
var socketio = __importStar(require("socket.io"));
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var devices = {
    ledStrip1: {
        state: new LedState.LedState(),
        ip: '192.168.0.6'
    }
};
/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device', function (req, res, next) {
    res.send(devices[req.params.device].state.getState());
    next();
});
server.post('/api/:device', function (req, res, next) {
    devices[req.params.device].state.setState(req.body);
    res.send({ savedChanges: true });
    next();
});
server.get("/*", restify.plugins.serveStatic({
    directory: __dirname + "/../public/",
    default: 'view.html'
}));
/* SOCKET.IO */
var io = socketio.listen(server.server);
io.on("connection", function (socket) {
    for (var _i = 0, _a = Object.entries(devices); _i < _a.length; _i++) {
        var device = _a[_i];
        socket.emit(device[0], JSON.stringify(device[1].state.getState()));
        socket.on(device[0], function (state) {
            device[1].state.setState(JSON.parse(state));
            broadcast("", device[1].state.getState(), device[0], socket);
        });
    }
});
var _loop_1 = function (device) {
    var _loop_3 = function (eventName) {
        device[1].state.emitter.addListener(eventName, function (e) {
            broadcast(eventName, e, device[0]);
        });
    };
    for (var _i = 0, _a = LedState.LedState.getEventNames(); _i < _a.length; _i++) {
        var eventName = _a[_i];
        _loop_3(eventName);
    }
};
/* BROADCASTING */
for (var _i = 0, _a = Object.entries(devices); _i < _a.length; _i++) {
    var device = _a[_i];
    _loop_1(device);
}
function broadcast(eventName, event, device, socket) {
    var _a;
    var message;
    if (eventName.length > 0) {
        message = JSON.stringify((_a = {}, _a[eventName] = event, _a));
    }
    else
        message = JSON.stringify(event);
    if (socket != undefined) {
        socket.broadcast.emit(device, message);
    }
    else
        io.emit(device, message);
}
var _loop_2 = function (device) {
    setInterval(function () {
        client.send(device[1].state.getLED(), 2390, '192.168.0.6');
    }, 60);
};
for (var _b = 0, _c = Object.entries(devices); _b < _c.length; _b++) {
    var device = _c[_b];
    _loop_2(device);
}
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
//# sourceMappingURL=Main.js.map