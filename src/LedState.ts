import { Color, RGB, HSV } from './color';
import { PulseEffect } from "./effects/PulseEffect";
import { RainbowEffect } from "./effects/RainbowEffect";
import * as Events from 'events';

export interface Dim {
    value: number;
}

export class LedState {
    private color: Color = new Color();
    private dim: Dim = { value: 1 };
    emitter: Events.EventEmitter = new Events.EventEmitter();
    private rainbow: RainbowEffect = new RainbowEffect(this.emitter, this.color);
    private pulse: PulseEffect = new PulseEffect(this.emitter, this.dim);
    getLED(): string {
        var color: RGB = this.color.toRGB();
        var r: string = ((color.r / 255) * 1000 * this.dim.value).toString();
        var g: string = ((color.g / 255) * 1000 * this.dim.value).toString();
        var b: string = ((color.b / 255) * 1000 * this.dim.value).toString();
        return r + ":" + g + ":" + b;
    }
    getState(): object {
        return {
            dim: this.dim.value,
            color: this.color.toHSV(),
            rainbow: this.rainbow.get(),
            pulse: this.pulse.get()
        };
    }
    setState(state: any) {
        if (state.dim != undefined) {
            this.setDim(Number(state.dim));
        }
        if (state.rainbow != undefined) {
            this.setRainbow(state.rainbow);
        }
        if (state.pulse != undefined) {
            this.setPulse(state.pulse);
        }
        if (state.color != undefined) {
            this.setColor(state.color);
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
        if (dim != this.dim.value && !this.pulse.getState()) {
            this.dim.value = dim;
        }
    }
    getRainbow(): RainbowEffect {
        return this.rainbow.get();
    }
    setRainbow(state: any) {
        if (state.state != undefined) {
            this.rainbow.setState(Boolean(state.state));
        }
        if (state.ms != undefined) {
            this.rainbow.setMs(Number(state.ms));
        }
        if (state.step != undefined) {
            this.rainbow.setStep(Number(state.step));
        }
    }
    getPulse(): PulseEffect {
        return this.pulse;
    }
    setPulse(state: any) {
        if (state.state != undefined) {
            this.pulse.setState(Boolean(state.state));
        }
        if (state.ms != undefined) {
            this.pulse.setMs(Number(state.ms));
        }
        if (state.step != undefined) {
            this.pulse.setStep(Number(state.step));
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
