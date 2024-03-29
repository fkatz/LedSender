import { LedState } from "./LedState";
import * as restify from "restify";
import socketio from "socket.io";
import dgram from 'dgram';
const client = dgram.createSocket('udp4');

/* MODEL */
interface Devices {
    [key: string]: LedState
}
var devices: Devices =
{
    ledStrip1: new LedState('192.168.0.6', 2390),
};

/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device',
    function (req: any, res: any, next: any) {
        if (devices[req.params.device] != undefined) {
            res.send(devices[req.params.device].get());
        }
        else {
            res.status(404);
            res.send({ code: "ResourceNotFound" });
        }
        next();
    });
server.post('/api/:device',
    function (req: any, res: any, next: any) {
        if (devices[req.params.device] != undefined) {
            devices[req.params.device].set(req.body);
            res.send({ saved: true });
        }
        else {
            res.status(404);
            res.send({ saved: false, code: "ResourceNotFound" });
        }

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
    console.log("[" + (new Date()).toLocaleString('en-US', { hour12: false }) + "] " + socket.request.headers['x-forwarded-for'] + " connected");
    for (var device of Object.entries(devices)) {
        socket.emit(device[0], JSON.stringify(device[1].get()));
        socket.on(device[0], function (state) {
            console.log("[" + (new Date()).toLocaleString('en-US', { hour12: false }) + "] " + socket.request.headers['x-forwarded-for'] + " set "+ device[0]);
            device[1].set(JSON.parse(state));
            broadcast(device[1].get(), device[0], socket);
        });
    }
})

function broadcast(state: object, device: string, socket?: any): void {
    var message: string = JSON.stringify(state);
    if (socket != undefined) {
        socket.broadcast.emit(device, message);
    }
    else io.emit(device, message);
}

for (let device of Object.entries(devices)) {
    setInterval(() => {
        device[1].update();
        broadcast(device[1].get(), device[0]);
        client.send(device[1].getData(), device[1].getPort(), device[1].getIP());
    }, device[1].getRefreshRate());
}

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});