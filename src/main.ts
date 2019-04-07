import {LedState} from "./LedState";
import * as restify from "restify";
import * as socketio from "socket.io";
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

/* MODEL */
interface Devices {
    [key: string]: LedState
}
var devices: Devices =
{
    ledStrip1: new LedState('192.168.0.6',2390),
};

/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device',
    function (req: any, res: any, next: any) {
        res.send(devices[req.params.device].get());
        next();
    });
server.post('/api/:device',
    function (req: any, res: any, next: any) {
        devices[req.params.device].set(req.body);
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
        socket.emit(device[0], JSON.stringify(device[1].get()));
        socket.on(device[0], function (state) {
            device[1].set(JSON.parse(state));
            broadcast("", device[1].get(), device[0], socket);
        });
    }
})

/* BROADCASTING */
for (let device of Object.entries(devices)) {
    for (let eventName of LedState.getEventNames()) {
        device[1].emitter.addListener(eventName, function (e:any) {
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
        device[1].update();
        client.send(device[1].getData(), device[1].getPort(), device[1].getIP());

    },device[1].getRefreshRate());
}


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});