import * as Events from 'events';

interface RGB {
    r: number;
    g: number;
    b: number;
}
interface HSV {
    h: number;
    s: number;
    v: number;
}
export class Color {
    fromHSVValues(h: number, s: number, v: number) {
        this.h = Number(h);
        this.s = Number(s);
        this.v = Number(v);
        return this;
    }
    fromHSV(value: HSV) {
        return this.fromHSVValues(value.h, value.s, value.v);
    }
    fromColor(value: Color) {
        this.fromHSV(value.toHSV());
        return this;
    }
    fromRGBValues(r: number, g: number, b: number) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }
        this.h = h;
        this.s = s;
        this.v = v;
        return this;
    }
    fromRGB(value: RGB) {
        return this.fromRGBValues(value.r, value.g, value.b);
    }
    fromHex(hex: string) {
        var rgb: RGB = <RGB>{};
        rgb.r = parseInt("0x" + hex.substr(1, 2));
        rgb.g = parseInt("0x" + hex.substr(3, 2));
        rgb.b = parseInt("0x" + hex.substr(5, 2));
        this.fromRGB(rgb);
        return this;
    }
    toHex(): string {
        var rgb: RGB = this.toRGB();
        var hex: string = "#";
        var r: string = rgb.r.toString(16);
        if (r.length < 2) r = "0" + r;
        var g: string = rgb.g.toString(16);
        if (g.length < 2) g = "0" + g;
        var b: string = rgb.b.toString(16);
        if (b.length < 2) b = "0" + b;
        hex += r + g + b;
        return hex;
    }
    toRGB(): RGB {
        var r, g, b;
        var h = this.h, s = this.s, v = this.v;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
            default: r = v, g = p, b = q; break;
        }
        var rgb: RGB = <RGB>{};
        rgb.r = Math.round(r * 255);
        rgb.g = Math.round(g * 255);
        rgb.b = Math.round(b * 255);
        return rgb;
    }
    toHSV(): HSV {
        var hsv: HSV = <HSV>{};
        hsv.h = Number(this.h);
        hsv.s = Number(this.s);
        hsv.v = Number(this.v);
        return hsv;
    }
    private h: number = 0;
    private s: number = 1;
    private v: number = 1;
}

interface Dim { value:number;}

export class ColorState {
    private color: Color = new Color();
    private dim: Dim = {value: 1};
    emitter: Events.EventEmitter = new Events.EventEmitter();
    private rainbow: RainbowEffect = new RainbowEffect(this.emitter, this.color);
    private pulse: PulseEffect= new PulseEffect(this.emitter,this.dim);
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
        }
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
                this.color.fromRGBValues(
                    color.rgb[0],
                    color.rgb[1],
                    color.rgb[2]
                );
            }

        }
        else if (typeof color.hsv != 'undefined') {
            let old: HSV = this.color.toHSV();
            color.hsv[0] = color.hsv[0];
            color.hsv[1] = color.hsv[1];
            color.hsv[2] = color.hsv[2];
            if (color.hsv[0] != old.h || color.hsv[1] != old.s || color.hsv[2] != old.v) {
                this.color.fromHSVValues(
                    color.hsv[0],
                    color.hsv[1],
                    color.hsv[2],
                );
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
    getPulse():PulseEffect{
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
    };
}
abstract class Effect {
    constructor(emitter: Events.EventEmitter) {
        this.emitter = emitter;
    }
    set(func: () => void, ms: number) {
        this.func = func;
        this.ms = ms;
        if(this.getState()) this.reset();
    }
    reset(): void {
        if (this.state) clearInterval(this.intervalFunc);
        this.intervalFunc = setInterval(() => {
            this.func();
            for (var event of Object.entries(this.events.onEffect)) {
                this.emitter.emit(event[0], event[1]());
            }
        }, this.ms);
        this.state = true;
    }
    unset(): void {
        clearInterval(this.intervalFunc);
        this.state = false;
    }
    setState(state: boolean) {
        state ? this.reset() : this.unset();
    }
    setFunc(func: () => void): void {
        this.func = func;
        if (this.getState()) this.reset();
    }
    setMs(ms: number): void {
        this.ms = ms;
        if(this.getState()) this.reset();
    }
    getState(): boolean {
        return this.state;;
    }
    get(): any {
        return {
            state: this.getState(),
            ms: this.ms
        }
    }
    protected state: boolean = false;
    protected abstract events: EventEntries;
    protected abstract func(): void;
    protected ms: number = 100;
    protected intervalFunc: any;
    protected emitter: Events.EventEmitter;
}
class RainbowEffect extends Effect {
    constructor(emitter: Events.EventEmitter, color: Color) {
        super(emitter);
        this.color = color;
    }
    setStep(step: number) {
        this.step = step;
        if (this.getState()) this.reset();
    }
    setColor(color: Color) {
        this.color = color;
        if (this.getState()) this.reset();
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        return intState;
    }
    func = () => {
        var hsv: HSV = this.color.toHSV();
        hsv.h += this.step;
        while (hsv.h >= 1) {
            hsv.h -= 1;
        }
        this.color.fromHSV(hsv);
    }
    protected events: EventEntries = {
        onEffect: { color: () => { return this.color.toHSV() } },
        onStateChange: { rainbow: () => { return this.get() } }
    };
    private step: number = 0.005;
    private color: Color;
}
class PulseEffect extends Effect {
    constructor(emitter: Events.EventEmitter, dim: Dim) {
        super(emitter);
        this.dim = dim;
    }
    setStep(step: number) {
        this.step = step;
        if (this.getState())this.reset();
    }
    setDim(dim: Dim) {
        this.dim = dim;
        if(this.getState())this.reset();
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        return intState;
    }
    reset(){
        this.radians = Math.acos(2*this.dim.value-1);
        super.reset();
    }
    func = () => {
        var dim:number = (Math.cos(this.radians)+1)/2;
        this.radians+=this.step;
        if(this.radians >=(2*Math.PI)) this.radians -= 4*Math.PI;
        this.dim.value = dim;
    }
    protected events: EventEntries = {
        onEffect: { dim: () => { return this.dim.value } },
        onStateChange: { pulse: () => { return this.get() } }
    };
    private step: number = 0.05;
    private radians:number = -2*Math.PI;
    private dim: Dim;
}

interface EventEntries {
    onEffect: {
        [name: string]: () => any;
    }
    onStateChange: {
        [name: string]: () => any;
    }
}