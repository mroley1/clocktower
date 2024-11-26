import { Alignmant } from "../RoleType"
import BaseReactState from "./_BaseReactState"

export namespace Player {
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean,
        name: string,
        role: string|undefined,
        viability: ViabilityJSON,
        position: Position,
        alignment: Alignmant
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
        private _role: string|undefined
        private _viability: Viability
        private _position: Position
        private _alignment: Alignmant
        
        private useSetter() {
            this.reactSetter([{
                type: "Player",
                UUID: this.UUID,
                active: this.active,
                name: this._name,
                role: this._role,
                viability: this._viability.reactSafe,
                position: this.position,
                alignment: this._alignment
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            this._name = reactState.name;
            this._role = reactState.role;
            this._viability = new Viability(reactState.viability.state, reactState.viability.deadVote)
            this._position = reactState.position
            this._alignment = reactState.alignment
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
        
        get role() {
            return this._role;
        }
        
        set role(role: string|undefined) {
            this._role = role;
            this.useSetter();
        }
        
        get alignment() {
            return this._alignment;
        }
        
        set alignment(alignment: Alignmant) {
            this._alignment = alignment;
            this.useSetter();
        }
        
        kill() {
            this._viability.kill();
            this.useSetter();
        }
        
        bury() {
            this._viability.bury();
            this.useSetter();
        }
        
        get isDead() {
            return this._viability.isDead
        }
        
        get looksDead() {
            return this._viability.looksDead
        }
        
        public toJSON() {
            const formatDocument: ReactState = {
                type: "PlayerCount",
                UUID: this.UUID,
                active: this.active,
                name: this._name,
                role: this._role,
                viability: this._viability.reactSafe,
                position: this._position,
                alignment: this._alignment
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
        BURIED
    }
    
    export class Viability {
        private _state: ViabilityState
        private _deadvote: boolean
        
        constructor(state: ViabilityState, deadVote: boolean) {
            this._state = state;
            this._deadvote = deadVote;
        }
        
        kill() {
            this._state = ViabilityState.DEAD
        }
        
        bury() {
            this._state = ViabilityState.BURIED
        }
        
        get canVote() {
            if (this._state == ViabilityState.DEAD && !this._deadvote) {
                return false
            }
            return true
        }
        
        vote() {
            if (this._state != ViabilityState.ALIVE) {
                this._deadvote = false
            }
        }
        
        get isDead() {
            return this._state == ViabilityState.DEAD
        }
        
        get looksDead() {
            return this._state != ViabilityState.ALIVE
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