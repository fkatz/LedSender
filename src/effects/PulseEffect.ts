import { Effect, EventEntries } from '../effects/Effect';
import { Dim } from '../LedState';
import * as Events from 'events';

export class PulseEffect extends Effect {
    constructor(emitter: Events.EventEmitter, dim: Dim) {
        super(emitter);
        this.dim = dim;
    }
    setStep(step: number) {
        this.step = step;
        if (this.getState())
            this.reset();
    }
    setDim(dim: Dim) {
        this.dim = dim;
        if (this.getState())
            this.reset();
    }
    get(): any {
        var intState = super.get();
        intState.step = this.step;
        return intState;
    }
    reset() {
        this.radians = Math.acos(2 * this.dim.value - 1);
        super.reset();
    }
    func = () => {
        var dim: number = (Math.cos(this.radians) + 1) / 2;
        this.radians += this.step;
        if (this.radians >= (2 * Math.PI))
            this.radians -= 4 * Math.PI;
        this.dim.value = dim;
    };
    protected events: EventEntries = {
        onEffect: { dim: () => { return this.dim.value; } },
        onStateChange: { pulse: () => { return this.get(); } }
    };
    private step: number = 0.05;
    private radians: number = -2 * Math.PI;
    private dim: Dim;
}
