export interface EventEntries {
    onEffect: {
        [name: string]: () => any;
    }
    onStateChange: {
        [name: string]: () => any;
    }
}

export abstract class Effect {
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
        }
    }
    protected state: boolean = false;
    protected abstract func(): void;
}
