import { CTUUID } from "../../../components/game/utility/UUID";
import BaseReactState from "./_BaseReactState";

export namespace Metadata {
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        stale: boolean
        gameID: number
        name: string
        created: number
    }
    

    function dbIdNew() {
        const current = localStorage.getItem("dbCurrentIndex")
        if (!current) {
            localStorage.setItem("dbCurrentIndex", "0")
            return 0
        } else {
            const next = parseInt(current) + 1
            localStorage.setItem("dbCurrentIndex", next.toString())
            return next
        }
    }
    
    export function create(): ReactState {
        return {type: "Metadata",
            UUID: CTUUID.create(),
            active: true,
            stale: false,
            name: "",
            gameID: dbIdNew(),
            created: Date.now()
        }
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        private stale
        
        private _gameID: number
        private _name: string
        private _created: number
        
        private useSetter() {
            this.stale = true;
            this.reactSetter([{
                type: "Metadata",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                gameID: this._gameID,
                name: this._name,
                created: this._created
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.stale = false;
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
                stale: this.stale,
                gameID: this._gameID,
                name: this._name,
                created: this._created
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 