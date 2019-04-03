"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Color = __importStar(require("./color"));
var restify = __importStar(require("restify"));
var socketio = __importStar(require("socket.io"));
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var colorStates = {
    ledStrip1: new Color.ColorState()
};
/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device', function (req, res, next) {
    res.send(colorStates[req.params.device].getState());
    next();
});
server.post('/api/:device', function (req, res, next) {
    colorStates[req.params.device].setState(req.body);
    res.send({ savedChanges: true });
    next();
});
server.get("/public/*", restify.plugins.serveStatic({
    directory: __dirname + "/../",
    default: 'view.html'
}));
/* SOCKET.IO */
var io = socketio.listen(server.server);
io.on("connection", function (socket) {
    for (var _i = 0, _a = Object.entries(colorStates); _i < _a.length; _i++) {
        var device = _a[_i];
        socket.emit(device[0], JSON.stringify(device[1].getState()));
        socket.on(device[0], function (state) {
            device[1].setState(JSON.parse(state));
            broadcast("", device[1].getState(), device, socket);
        });
    }
});
var _loop_1 = function (device) {
    var _loop_2 = function (eventName) {
        device[1].emitter.addListener(eventName, function (e) {
            broadcast(eventName, e, device);
        });
    };
    for (var _i = 0, _a = Color.ColorState.getEventNames(); _i < _a.length; _i++) {
        var eventName = _a[_i];
        _loop_2(eventName);
    }
};
/* BROADCASTING */
for (var _i = 0, _a = Object.entries(colorStates); _i < _a.length; _i++) {
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
        socket.broadcast.emit(device[0], message);
    }
    else
        io.emit(device[0], message);
    client.send(device[1].getLED(), 2390, '192.168.0.6');
}
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
//# sourceMappingURL=main.js.map