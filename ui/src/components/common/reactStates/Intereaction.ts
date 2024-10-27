import BaseReactState from "./_BaseReactState";

export namespace Interaction {
    
    export enum Effect {
        CHOOSE,  //^0 player choice
        KILL,    //^1 mark as dead
        POISON,  //^2 poision
        MADDEN,  //^3 make mad
        GRANT,   //^4 give the ability of
        CHANGE,  //^5 change role
        CORRUPT, //^6 change alignment
        IMBIBE,  //^7 make drunk
        PROTECT, //^8 protect from killing
        REVIVE,  //^9 bring back to life
        NONE     //^10 no effect
    }
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        owner: string
        bound: boolean
        name: string
        length: number
        effect: Effect
        effected: string
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _owner: string
        private _bound: boolean
        private _name: string
        private _length: number
        private _effect: Effect
        private _effected: string
        
        private applyFunc: (orgState: ReactState) => ReactState
        
        private useSetter() {
            this.reactSetter([{
                type: "Interaction",
                UUID: this.UUID,
                active: this.active,
                owner: this._owner,
                bound: this._bound,
                name: this._name,
                length: this._length,
                effect: this._effect,
                effected: this._effected
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            
            this._owner = reactState.owner;
            this._bound = reactState.bound;
            this._name = reactState.name;
            this._length = reactState.length;
            this._effect = reactState.effect;
            this._effected = reactState.effected;
            
            this.applyFunc = getApplyFunc(this._effect)
        }
        
        get owner() {
            return this._owner
        }
        
        get effected() {
            return this._effected
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Interaction",
                UUID: this.UUID,
                active: this.active,
                owner: this._owner,
                bound: this._bound,
                name: this._name,
                length: this._length,
                effect: this._effect,
                effected: this._effected
            }
            return JSON.stringify(formatDocument)
        }
    }
    
    function getApplyFunc(effect: Effect): (orgState: ReactState) => ReactState {
        try {
            return ["_" + Effect[effect]] as any as (orgState: ReactState) => ReactState
        }
        catch {
            return _NONE
        }
    }
    
    function _CHOOSE(orgState: ReactState) {
        console.log("choose")
        return orgState
    }
    
    function _KILL(orgState: ReactState) {
        return orgState
    }
    
    function _POISON(orgState: ReactState) {
        return orgState
    }
    
    function _MADDEN(orgState: ReactState) {
        return orgState
    }
    
    function _IMBIBE(orgState: ReactState) {
        return orgState
    }
    
    function _PROTECT(orgState: ReactState) {
        return orgState
    }
    
    function _REVIVE(orgState: ReactState) {
        return orgState
    }
    
    function _NONE(orgState: ReactState) {
        return orgState
    }
}

 