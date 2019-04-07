import { Effect } from '../effects/Effect';
import { Dim } from '../LedState';

export class PulseEffect extends Effect {
    constructor(dim: Dim) {
        super();
        this.dim = dim;
    }
    set(state: any) {
        super.set(state);
        if (state.step != undefined) {
            this.setStep(Number(state.step));
        }
        if (state.minValue != undefined) {
            this.setMinValue(Number(state.minValue));
        }
    }
    setStep(step: number) {
        this.step = step;
    }
    setDim(dim: Dim) {
        this.dim = dim;
        this.resetRadians();
    }
    setMinValue(minValue: number) {
        this.minValue = minValue;
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        intState.minValue = this.minValue;
        return intState;
    }
    resetRadians() {
        this.radians = Math.acos(2 * (this.dim.value - this.minValue) / (1 - this.minValue) - 1)
    }
    func = () => {
        var dim: number = this.minValue + (1 - this.minValue) * (Math.cos(this.radians) + 1) / 2;
        this.radians += this.step;
        if (this.radians >= 2 * Math.PI) {
            this.radians -= 4 * Math.PI;
        }
        else if (this.radians <= -2 * Math.PI) {
            this.radians += 4 * Math.PI;
        }
        this.dim.value = dim;
    };
    private step: number = 0.05;
    private radians: number = -2 * Math.PI;
    private minValue: number = 0.2;
    private dim: Dim;
}
