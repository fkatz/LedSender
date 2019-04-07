import { Effect } from './Effect';
import { Color, HSV } from '../color';

export class RainbowEffect extends Effect {
    constructor(color: Color) {
        super();
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
    private step: number = 0.005;
    private color: Color;
}