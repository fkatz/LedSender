import * as Events from 'events';

export interface EventEntries {
    onEffect: {
        [name: string]: () => any;
    }
    onStateChange: {
        [name: string]: () => any;
    }
}

export abstract class Effect {
    constructor(emitter: Events.EventEmitter) {
        this.emitter = emitter;
    }
    set(func: () => void, ms: number) {
        this.func = func;
        this.ms = ms;
        if (this.getState())
            this.reset();
    }
    reset(): void {
        if (this.state)
            clearInterval(this.intervalFunc);
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
        if (this.getState())
            this.reset();
    }
    setMs(ms: number): void {
        this.ms = ms;
        if (this.getState())
            this.reset();
    }
    getState(): boolean {
        return this.state;
        ;
    }
    get(): any {
        return {
            state: this.getState(),
            ms: this.ms
        };
    }
    protected state: boolean = false;
    protected abstract events: EventEntries;
    protected abstract func(): void;
    protected ms: number = 60;
    protected intervalFunc: any;
    protected emitter: Events.EventEmitter;
}
