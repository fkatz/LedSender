import * as Color from "./color";
import * as LedState from "./LedState";
import * as restify from "restify";
import * as socketio from "socket.io";
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

/* MODEL */
interface Devices {
    [key: string]: {
        state: LedState.LedState,
        ip: string
    };
}
var devices: Devices =
{
    ledStrip1: {
        state: new LedState.LedState(),
        ip: '192.168.0.6'
    }
};

/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device',
    function (req: any, res: any, next: any) {
        res.send(devices[req.params.device].state.getState());
        next();
    });
server.post('/api/:device',
    function (req: any, res: any, next: any) {
        devices[req.params.device].state.setState(req.body);
        res.send({ savedChanges: true });
        next();
    });
server.get("/*",
    restify.plugins.serveStatic({
        directory: __dirname + "/../public/",
        default: 'view.html'
    })
)

/* SOCKET.IO */
var io = socketio.listen(server.server);
io.on("connection", function (socket) {
    for (var device of Object.entries(devices)) {
        socket.emit(device[0], JSON.stringify(device[1].state.getState()));
        socket.on(device[0], function (state) {
            device[1].state.setState(JSON.parse(state));
            broadcast("", device[1].state.getState(), device[0], socket);
        });
    }
})

/* BROADCASTING */
for (let device of Object.entries(devices)) {
    for (let eventName of LedState.LedState.getEventNames()) {
        device[1].state.emitter.addListener(eventName, function (e:any) {
            broadcast(eventName, e, device[0]);
        });
    }
}

function broadcast(eventName: string, event: object, device: string, socket?: any): void {
    var message: string;
    if (eventName.length > 0) {
        message = JSON.stringify({ [eventName]: event, });
    } else message = JSON.stringify(event);
    if (socket != undefined) {
        socket.broadcast.emit(device, message);
    }
    else io.emit(device, message);
}

for (let device of Object.entries(devices)) {
    setInterval(() => {
        client.send(device[1].state.getLED(), 2390, '192.168.0.6');

    },60)
}


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});