import dgram from 'dgram';

export class AudioDevice{
    constructor(port:number){
        this.client = dgram.createSocket('udp4');
        this.client.bind(port);
        this.client.on('listening', () => {
            let addr = this.client.address();
            console.log(`Listening for UDP packets at port ${addr.port}`);
        });

        this.client.on('error', (err: any) => {
            console.error(`UDP error: ${err.stack}`);
        });


        this.client.on('message', (msg: any, rinfo: any) => {
            this.audioValues = [];
            for (let i = 0; i < Buffer.byteLength(msg) / 8; i++) {
                this.audioValues[i] = msg.readDoubleLE(i * 8);
            }
        });
    }
    public getSpectrum(){
        return this.audioValues;
    }
    private client:any;
    private audioValues: number[] = [];

}