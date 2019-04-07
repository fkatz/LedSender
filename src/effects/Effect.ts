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
    set(state: any) {
        if (state.state != undefined) {
            this.setState(Boolean(state.state));
        }
    }
    setState(state: boolean) {
        this.state = state;
    }
    getState(): boolean {
        return this.state;
    }
    get(): any {
        return {
            state: this.state
        };
    }
    doEffect():void{
        if(this.state){
            this.func();
            for (var event of Object.entries(this.events.onEffect)) {
                this.emitter.emit(event[0], event[1]());
            }
        }
    }
    protected state: boolean = false;
    protected abstract events: EventEntries;
    protected abstract func(): void;
    protected emitter: Events.EventEmitter;
}
