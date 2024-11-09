import BaseReactState from "./_BaseReactState";

export namespace Metadata {
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        gameID: number
        name: string
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _gameID: number
        private _name: string
        
        private useSetter() {
            this.reactSetter([{
                type: "Metadata",
                UUID: this.UUID,
                active: this.active,
                gameID: this._gameID,
                name: this._name
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            this._gameID = reactState.gameID;
            this._name = reactState.name;
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Metadata",
                UUID: this.UUID,
                active: this.active,
                gameID: this._gameID,
                name: this._name
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 