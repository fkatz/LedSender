import * as Color from "./color";
import * as restify from "restify";
import * as socketio from "socket.io";
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

/* MODEL */
interface ColorStates {
    [key: string]: Color.ColorState;
}
var colorStates: ColorStates =
{
    ledStrip1: new Color.ColorState()
};

/* RESTIFY */
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/api/:device',
    function (req: any, res: any, next: any) {
        res.send(colorStates[req.params.device].getState());
        next();
    });
server.post('/api/:device',
    function (req: any, res: any, next: any) {
        colorStates[req.params.device].setState(req.body);
        res.send({ savedChanges: true });
        next();
    });
server.get("/public/*",
    restify.plugins.serveStatic({
        directory: __dirname + "/../",
        default: 'view.html'
    })
)

/* SOCKET.IO */
var io = socketio.listen(server.server);
io.on("connection", function (socket) {
    for (var device of Object.entries(colorStates)) {
        socket.emit(device[0], JSON.stringify(device[1].getState()));
        socket.on(device[0], function (state) {
            device[1].setState(JSON.parse(state));
            broadcast("",device[1].getState(),device,socket);
        });
    }
})

/* BROADCASTING */
for (let device of Object.entries(colorStates)) {
    for (let eventName of Color.ColorState.getEventNames()) {
        device[1].emitter.addListener(eventName, function (e) {
            broadcast(eventName, e, device);
        });
    }
}

function broadcast(eventName: string, event: object, device: [string, Color.ColorState],socket?:any): void {
    var message:string;
    if(eventName.length>0) {
        message = JSON.stringify({ [eventName]: event, });
    } else message = JSON.stringify(event);
    if(socket!=undefined) {
        socket.broadcast.emit(device[0], message);
    }
    else io.emit(device[0], message);
    client.send(device[1].getLED(), 2390, '192.168.0.6');
}


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});