import { Effect, Dim } from '../effects/Effect';
import { AudioDevice } from '../AudioDevice';

export class AudioEffect extends Effect implements Dim {
    constructor(port: number) {
        super();
        this.audioDevice = new AudioDevice(port);
    }
    set(state: any) {
        super.set(state);
        if (state.freq != undefined) {
            this.setFreq(Number(state.freq));
        }
        if (state.minValue != undefined) {
            this.setMinValue(Number(state.minValue));
        }
    }
    getDim() {
        return this.state? this.dim:1;
    }
    setFreq(freq: number) {
        this.freq = freq;
    }
    setMinValue(minValue: number) {
        if (minValue < 1) {
            this.minValue = minValue;
        }
    }
    get(): any {
        var intState = super.get();
        intState.freq = this.freq;
        intState.minValue = this.minValue;
        intState.spectrum = this.audioDevice.getSpectrum();
        intState.dim = this.dim;
        return intState;
    }
    func = () => {
        if (this.audioDevice.getSpectrum()[this.freq] != undefined) {
            this.dim = this.minValue + this.audioDevice.getSpectrum()[this.freq] * (1 - this.minValue);
        }
    };
    private minValue: number = 0;
    private dim: number = 1;
    private freq: number = 0;
    private audioDevice: AudioDevice;
}
