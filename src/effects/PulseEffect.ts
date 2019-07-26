import { Effect, Dim } from '../effects/Effect';

export class PulseEffect extends Effect implements Dim{
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
    getDim() {
        return this.state ? this.dim : 1;
    }
    setMinValue(minValue: number) {
        this.minValue = minValue;
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        intState.minValue = this.minValue;
        intState.dim = this.dim;
        return intState;
    }
    resetRadians() {
        this.radians = Math.acos(2 * (this.dim - this.minValue) / (1 - this.minValue) - 1)
    }
    func = () => {
        this.dim = this.minValue + (1 - this.minValue) * (Math.cos(this.radians) + 1) / 2;
        this.radians += this.step;
        if (this.radians >= 2 * Math.PI) {
            this.radians -= 4 * Math.PI;
        }
        else if (this.radians <= -2 * Math.PI) {
            this.radians += 4 * Math.PI;
        }
    };
    private step: number = 0.05;
    private radians: number = -2 * Math.PI;
    private minValue: number = 0.2;
    private dim: number = 1;
}
