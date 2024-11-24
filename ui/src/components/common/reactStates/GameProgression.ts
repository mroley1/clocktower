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
        progressId: number
        currentTurn: string|undefined
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _progressId: number = 0;
        private _currentTurn: string|undefined
        
        private useSetter() {
            this.reactSetter([{
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                progressId: this._progressId,
                currentTurn: this._currentTurn
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.reactSetter = reactSetter;
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            
            this._progressId = reactState.progressId;
            this._currentTurn = reactState.currentTurn;
        }
        
        nextStage = (): Data => {
            if (this._progressId == 1) {
                this._progressId = 0b10
            } else {
                this._progressId += 0b10
            }
            this.useSetter();
            return this;
        }
        
        enterSetup = (): void => {
            this._progressId |= 0b1
            this.useSetter()
        }
        
        leaveSetup = (): void => {
            this._progressId &= 0b1
            this.useSetter()
        }
        
        toggleSetup = (): void => {
            this._progressId ^= 0b1
            this.useSetter()
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
        
        get currentTurn(): string|undefined {
            return this._currentTurn;
        }
        
        set currentTurn(currentTurn: string|undefined) {
            this._currentTurn = currentTurn;
            this.useSetter()
        }
        
        get currentTurnOwner(): string|undefined {
            if (!this._currentTurn?.startsWith("_")) {
                return this.currentTurn
            }
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "GameProgression",
                UUID: this.UUID,
                active: this.active,
                progressId: this._progressId,
                currentTurn: this._currentTurn
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 