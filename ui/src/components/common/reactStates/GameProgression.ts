import { CTUUID } from "../../../components/game/utility/UUID";
import { prgressIdToDayState } from "../GameProgressionTranslator";
import BaseReactState from "./_BaseReactState";

export namespace GameProgression {
    export enum State {
        SETUP,
        DAY,
        NIGHT
    }
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        stale: boolean
        progressId: number
    }
    
    export function create(): ReactState {
        return {type: "GameProgression",
            UUID: CTUUID.create(),
            active: true,
            stale: false,
            progressId: 1
        }
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        private stale
        
        private _progressId: number = 0;
        
        private useSetter() {
            this.stale = true;
            this.reactSetter([{
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                progressId: this._progressId
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.reactSetter = reactSetter;
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.stale = false;
            
            this._progressId = reactState.progressId;
        }
        
        nextStage = (): Data => {
            this._progressId &= ~0b1
            this._progressId += 0b10
            this.useSetter();
            return this;
        }
        
        enterSetup = (): void => {
            this._progressId |= 0b1
            this.useSetter()
        }
        
        leaveSetup = (): void => {
            if (this._progressId == 1) {
                this.nextStage()
            } else {
                this._progressId &= ~0b1
            }
            this.useSetter()
        }
        
        toggleSetup = (): void => {
            if (this.isSetup) {
                this.leaveSetup()
            } else {
                this.enterSetup()
            }
        }
        
        get progressId() {
            return this._progressId;
        }
        
        get state(): State {
            return prgressIdToDayState(this._progressId).state;
        }
        
        get night(): State {
            return prgressIdToDayState(this._progressId).night;
        }
        
        get isSetup(): boolean {
            return this.state == State.SETUP;
        }
        
        get isDay(): boolean {
            return this.state == State.DAY;
        }
        
        get isNight(): boolean {
            return this.state == State.NIGHT;
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                progressId: this._progressId
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 