import BaseReactState from "./_BaseReactState"

export namespace Player {
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean,
        name: string,
        role: number,
        viability: ViabilityJSON,
        position: Position
    }
    
    export interface Position {
        x: number,
        y: number
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _name: string
        private _role: number
        private _viability: Viability
        private _position: Position
        
        private useSetter() {
            this.reactSetter([{
                type: "Player",
                UUID: this.UUID,
                active: this.active,
                name: this._name,
                role: this._role,
                viability: this._viability.reactSafe,
                position: this.position
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this._name = reactState.name;
            this._role = reactState.role;
            this._viability = new Viability(reactState.viability.state, reactState.viability.deadVote)
            this._position = reactState.position
            this.reactSetter = reactSetter;
        }
        
        get id() {
            return this.UUID
        }
        
        get position() {
            return this._position
        }
        
        set position(position: Position) {
            this._position = position
            this.useSetter()
        }
        
        public toJSON() {
            const formatDocument: ReactState = {
                type: "PlayerCount",
                UUID: this.UUID,
                active: this.active,
                name: this._name,
                role: this._role,
                viability: this._viability.reactSafe,
                position: this._position
            }
            return JSON.stringify(formatDocument)
        }
    }
    
    interface ViabilityJSON {
        state: ViabilityState,
        deadVote: boolean
    }
    
    export enum ViabilityState {
        ALIVE,
        DEAD,
        SLEEPING,
        DEADVOTE
    }
    
    export class Viability {
        private _state: ViabilityState
        private _deadvote: boolean
        
        constructor(state: ViabilityState, deadVote: boolean) {
            this._state = state;
            this._deadvote = deadVote;
        }
        
        get reactSafe(): ViabilityJSON {
            return {
                state: this._state,
                deadVote: this._deadvote
            }
        }
        
        toJSON() {
            return JSON.stringify({
                state: this._state,
                deadVote: this._deadvote
            })
        }
    }
}