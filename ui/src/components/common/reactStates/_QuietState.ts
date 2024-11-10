import BaseReactState from "./_BaseReactState";

export namespace _QuietState {
    
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean,
        currentTurnOwner: string|undefined
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _currentTurnOwner
        
        private useSetter() {
            this.reactSetter([{
                type: "_QuietState",
                UUID: this.UUID,
                active: this.active,
                currentTurnOwner: this._currentTurnOwner
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            this._currentTurnOwner = reactState.currentTurnOwner;
        }
        
        get currentTurnOwner() {
            return this._currentTurnOwner
        }
        
        set currentTurnOwner(currentTurnOwner: string|undefined) {
            this._currentTurnOwner = currentTurnOwner;
            this.useSetter()
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "_QuietState",
                UUID: this.UUID,
                active: this.active,
                currentTurnOwner: this._currentTurnOwner
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 