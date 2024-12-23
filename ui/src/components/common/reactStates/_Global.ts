import { CTUUID } from "../../../components/game/utility/UUID";
import BaseReactState from "./_BaseReactState";

export namespace _Global {
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        stale: boolean
        currentSelected: string|undefined
    }
    
    export function create(): ReactState {
        return {
            type: "_Global",
            UUID: CTUUID.create(),
            active: true,
            stale: false,
            currentSelected: undefined
        }
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        private stale
        
        private _currentSelected: string|undefined
        
        private useSetter() {
            this.stale = true;
            this.reactSetter([{
                type: "_Global",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                currentSelected: this._currentSelected
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.stale = false;
            this.reactSetter = reactSetter;
            
            this._currentSelected = reactState.currentSelected
        }
        
        get currentSelected() {
            return this._currentSelected
        }
        
        set currentSelected(currentSelected: string|undefined) {
            this._currentSelected = currentSelected;
            this.useSetter()
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "_Global",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                currentSelected: this._currentSelected
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 