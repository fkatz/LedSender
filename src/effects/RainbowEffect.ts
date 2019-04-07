import { Effect, EventEntries } from './Effect';
import * as Events from 'events';
import { Color, HSV } from '../color';

export class RainbowEffect extends Effect {
    constructor(emitter: Events.EventEmitter, color: Color) {
        super(emitter);
        this.color = color;
    }
    setStep(step: number) {
        this.step = step;
        if (this.getState())
            this.reset();
    }
    setColor(color: Color) {
        this.color = color;
        if (this.getState())
            this.reset();
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
    };
    protected events: EventEntries = {
        onEffect: { color: () => { return this.color.toHSV(); } },
        onStateChange: { rainbow: () => { return this.get(); } }
    };
    private step: number = 0.005;
    private color: Color;
}
