import { Color, RGB, HSV } from './color';
import { PulseEffect } from "./effects/PulseEffect";
import { RainbowEffect } from "./effects/RainbowEffect";
import * as Events from 'events';
import { Effect } from './effects/Effect';

export interface Dim {
    value: number;
}
interface Effects {
    [key: string]: Effect;
}
interface Device {
    getIP():string;
    getPort():number;
    getRefreshRate():number;
    getData():any;
    update():void;
}

export class LedState implements Device {
    private color: Color = new Color();
    private dim: Dim = { value: 1 };
    private refreshRate: number = 60;
    private ip: string;
    private port: number;
    emitter: Events.EventEmitter = new Events.EventEmitter();
    public effects: Effects = {
        rainbow: new RainbowEffect(this.emitter, this.color),
        pulse: new PulseEffect(this.emitter, this.dim)
    }

    constructor(ip: string,port:number, refreshRate?: number) {
        if (refreshRate != undefined) this.refreshRate = refreshRate;
        this.ip = ip;
        this.port = port;
    }
    getData(): string {
        var color: RGB = this.color.toRGB();
        var r: string = ((color.r / 255) * 1000 * this.dim.value).toString();
        var g: string = ((color.g / 255) * 1000 * this.dim.value).toString();
        var b: string = ((color.b / 255) * 1000 * this.dim.value).toString();
        return r + ":" + g + ":" + b;
    }
    getIP():string{
        return this.ip;
    }
    getPort(): number {
        return this.port;
    }
    getRefreshRate():number{
        return this.refreshRate;
    }
    get(): any {
        var state: any = {
            dim: this.dim.value,
            color: this.color.toHSV(),
            ip: this.ip,
            refreshRate: this.refreshRate
        };
        for (let effect of Object.entries(this.effects)) {
            state[effect[0]] = effect[1].get();
        }
        return state;
    }
    set(state: any) {
        if (state.dim != undefined) {
            this.dim.value = Number(state.dim);
        }
        if (state.ip != undefined) {
            this.ip = state.ip;
        }
        if (state.refreshRate != undefined) {
            this.refreshRate = state.refreshRate;
        }
        if (state.color != undefined) {
            this.setColor(state.color);
        }
        for (let effect of Object.entries(this.effects)) {
            if (state[effect[0]] != undefined) {
                effect[1].set(state[effect[0]]);
            }
        }
    }
    getColor(): HSV {
        return this.color.toHSV();
    }
    setColor(color: any) {
        if (typeof color.hex != 'undefined') {
            if (color.hex != this.color.toHex()) {
                this.color.fromHex(color.hex);
            }
        }
        else if (typeof color.rgb != 'undefined') {
            let old: RGB = this.color.toRGB();
            if (color.rgb[0] != old.r || color.rgb[1] != old.g || color.rgb[2] != old.b) {
                this.color.fromRGBValues(color.rgb[0], color.rgb[1], color.rgb[2]);
            }
        }
        else if (typeof color.hsv != 'undefined') {
            let old: HSV = this.color.toHSV();
            color.hsv[0] = color.hsv[0];
            color.hsv[1] = color.hsv[1];
            color.hsv[2] = color.hsv[2];
            if (color.hsv[0] != old.h || color.hsv[1] != old.s || color.hsv[2] != old.v) {
                this.color.fromHSVValues(color.hsv[0], color.hsv[1], color.hsv[2]);
            }
        }
    }
    update():void{
        for (var effect of Object.values(this.effects)) {
            effect.doEffect();
        }
    }
    static getEventNames(): string[] {
        return [
            "color",
            "dim",
            "rainbow",
            "pulse"
        ];
    }
    ;
}
