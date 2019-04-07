import { Effect, EventEntries } from './Effect';
import * as Events from 'events';
import { Color, HSV } from '../color';

export class RainbowEffect extends Effect {
    constructor(emitter: Events.EventEmitter, color: Color) {
        super(emitter);
        this.color = color;
    }
    set(state: any) {
        super.set(state);
        if (state.step != undefined) {
            this.setStep(Number(state.step));
        }
    }
    setStep(step: number) {
        this.step = step;
    }
    setColor(color: Color) {
        this.color = color;
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        return intState;
    }
    func = () => {
        console.log("funca")
        var hsv: HSV = this.color.toHSV();
        hsv.h += this.step;
        if (hsv.h >= 1) {
            while (hsv.h >= 1) {
                hsv.h -= 1;
            }
        } else if (hsv.h < 0) {
            while (hsv.h < 0) {
                hsv.h += 1;
            }
        }
        this.color.fromHSV(hsv);
    };
    protected events: EventEntries = {
        onEffect: { color: () => { return this.color.toHSV(); } },
        onStateChange: { rainbow: () => { return this.get(); } }
    };
    private step: number = 0.005;
    private color: Color;
}