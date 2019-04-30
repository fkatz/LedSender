import { Effect } from '../effects/Effect';
import { Dim } from '../LedState';
import { AudioDevice } from '../AudioDevice';

export class AudioEffect extends Effect {
    constructor(port:number, dim: Dim) {
        super();
        this.dim = dim;
        this.audioDevice = new AudioDevice(port);
    }
    set(state: any) {
        super.set(state);
        if (state.freq != undefined) {
            this.setFreq(Number(state.freq));
        }
    }
    setDim(dim: Dim) {
        this.dim = dim;
    }
    setFreq(freq: number) {
        this.freq = freq;
    }
    get(): any {
        var intState = super.get();
        intState.freq = this.freq;
        intState.spectrum = this.audioDevice.getSpectrum();
        return intState;
    }
    func = () => {
        if (this.audioDevice.getSpectrum()[this.freq]!=undefined){
            var dim: number = this.audioDevice.getSpectrum()[this.freq];
            this.dim.value = dim;
        }
    };
    private dim: Dim;
    private freq: number = 0;
    private audioDevice: AudioDevice;
}
