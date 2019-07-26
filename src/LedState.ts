import { Color, RGB, HSV } from './color';
import { PulseEffect } from "./effects/PulseEffect";
import { RainbowEffect } from "./effects/RainbowEffect";
import { AudioEffect } from "./effects/AudioEffect";
import { Effect, Dim } from './effects/Effect';

interface Effects {
    [key: string]: Effect;
}
interface Device {
    getIP(): string;
    getPort(): number;
    getRefreshRate(): number;
    getData(): any;
    update(): void;
}

export class LedState implements Device {
    private color: Color = new Color();
    private refreshRate: number = 60;
    private ip: string;
    private port: number;
    public effects: Effects = {
        rainbow: new RainbowEffect(this.color),
        pulse: new PulseEffect(),
        audio: new AudioEffect(8081)
    }

    constructor(ip: string, port: number, refreshRate?: number) {
        if (refreshRate != undefined) this.refreshRate = refreshRate;
        this.ip = ip;
        this.port = port;
    }
    getData(): string {
        var color: RGB = this.color.toRGB();
        var dim = Object.values(this.effects as unknown as Dim)
            .filter((effect) => { return effect.getDim != undefined })
            .map((effect) => { return effect.getDim() })
            .reduce((acum: number, dim: number) => { return acum * dim; });
        var r: string = ((color.r / 255) * 1000 * dim).toString();
        var g: string = ((color.g / 255) * 1000 * dim).toString();
        var b: string = ((color.b / 255) * 1000 * dim).toString();
        return r + ":" + g + ":" + b;
    }
    getIP(): string {
        return this.ip;
    }
    getPort(): number {
        return this.port;
    }
    getRefreshRate(): number {
        return this.refreshRate;
    }
    get(): any {
        var state: any = {
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
    update(): void {
        for (var effect of Object.values(this.effects)) {
            effect.doEffect();
        }
    }
}
