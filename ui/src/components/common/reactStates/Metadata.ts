import BaseReactState from "./_BaseReactState";

export namespace Metadata {
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        gameID: number
        name: string
        created: number
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _gameID: number
        private _name: string
        private _created: number
        
        private useSetter() {
            this.reactSetter([{
                type: "Metadata",
                UUID: this.UUID,
                active: this.active,
                gameID: this._gameID,
                name: this._name,
                created: this._created
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            this._gameID = reactState.gameID;
            this._name = reactState.name;
            this._created = reactState.created;
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Metadata",
                UUID: this.UUID,
                active: this.active,
                gameID: this._gameID,
                name: this._name,
                created: this._created
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 