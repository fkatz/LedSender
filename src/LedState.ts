import { Color, RGB, HSV } from './color';
import { PulseEffect } from "./effects/PulseEffect";
import { RainbowEffect } from "./effects/RainbowEffect";
import * as Events from 'events';
import { Effect } from './effects/Effect';

export interface Dim {
    value: number;
}
interface Effects{
    [key: string]: Effect;
}

export class LedState {
    private color: Color = new Color();
    private dim: Dim = { value: 1 };
    emitter: Events.EventEmitter = new Events.EventEmitter();
    public effects:Effects = {
        rainbow: new RainbowEffect(this.emitter,this.color),
        pulse: new PulseEffect(this.emitter,this.dim)
    }
    getLED(): string {
        var color: RGB = this.color.toRGB();
        var r: string = ((color.r / 255) * 1000 * this.dim.value).toString();
        var g: string = ((color.g / 255) * 1000 * this.dim.value).toString();
        var b: string = ((color.b / 255) * 1000 * this.dim.value).toString();
        return r + ":" + g + ":" + b;
    }
    getState(): any {
        var state: any = {
            dim: this.dim.value,
            color: this.color.toHSV(),
        };
        for (let effect of Object.entries(this.effects)){
            state[effect[0]] = effect[1].get();
        }
    }
    setState(state: any) {
        if (state.dim != undefined) {
            this.setDim(Number(state.dim));
        }
        for (let effect of Object.entries(this.effects)) {
            effect[1].set(state[effect[0]]);
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
    getDim(): number {
        return this.dim.value;
    }
    setDim(dim: number) {
        if (dim != this.dim.value) {
            this.dim.value = dim;
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
