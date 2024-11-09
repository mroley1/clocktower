import BaseReactState from "./_BaseReactState";

export namespace GameProgression {
    export enum State {
        SETUP,
        DAY,
        NIGHT
    }
    
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean,
        state: State,
        night: number,
        stored: State|undefined
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _state: State = State.SETUP;
        private _night: number = 0;
        private _stored: State|undefined;
        
        private useSetter() {
            this.reactSetter([{
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                state: this._state,
                night: this._night,
                stored: this._stored
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.reactSetter = reactSetter;
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            
            this._state = reactState.state;
            this._night = reactState.night;
            this._stored = reactState.stored;
        }
        
        private pushStored(state: State): boolean {
            if (this._stored) {
                return false;
            } else {
                this._stored = this._state;
                this._state = state;
                this.useSetter();
                return true;
            }
        }
        
        private popStored(): boolean {
            if (this._stored) {
                this._state = this._stored;
                this._stored = undefined;
                this.useSetter();
                return true;
            } else {
                return true;
            }
        }
        
        nextStage = (): Data => {
            this.popStored();
            if (this.night == 0) {
                this._night = 1;
                this._state = State.NIGHT
            } else {
                if (this.isDay) {
                    this._night++
                    this._state = State.NIGHT
                } else {
                    this._state = State.DAY
                }
            }
            this.useSetter();
            return this;
        }
        
        enterSetup = (): boolean => {
            return this.pushStored(State.SETUP);
        }
        
        leaveSetup = (): boolean => {
            if (this.isSetup) {
                return this.popStored();
            } else {
                return false;
            }
        }
        
        get state(): State {
            return this._state;
        }
        
        get night(): State {
            return this._night;
        }
        
        get isSetup(): boolean {
            return this._state == State.SETUP;
        }
        
        get isDay(): boolean {
            return this._state == State.DAY;
        }
        
        get isNight(): boolean {
            return this._state == State.NIGHT;
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                state: this._state,
                night: this._night,
                stored: this._stored
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 