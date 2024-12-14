import { ReferenceData } from "../ReferenceData";
import BaseReactState from "./_BaseReactState";
import { Player } from "./Player";

export namespace Interaction {
    
    export enum Effect {
        NONE,    //^0 no effect
        KILL,    //^1 mark as dead
        POISON,  //^2 poision
        MADDEN,  //^3 make mad
        GRANT,   //^4 give the ability of
        CHANGE,  //^5 change role
        CORRUPT, //^6 change alignment
        IMBIBE,  //^7 make drunk
        PROTECT, //^8 protect from killing
        REVIVE,  //^9 bring back to life
        BURY     //^10 make it look like they are dead
    }
    
    export enum ProtectionCoverage {
        ALL,       // protected from all forms of death
        EXECUTION, // protected from execution / exile
        DEMON      // protected from the demon
    }
    // ! /\ and \/ need to be implemented logically !
    export enum EffectAvailability {
        PUBLIC, // available everyehere
        TURN,   // must be owner's turn to use (night time)
        NIGHT,  // any time during night
        DAY,    // any time during the day
        SETUP   // any time during setup
    }
    
    // effects that are shown next to player on board
    export const visibleEffects = [Effect.POISON, Effect.MADDEN, Effect.GRANT, Effect.IMBIBE, Effect.PROTECT, Effect.BURY]
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        owner: string // who applied effect (by current turn)
        end: number // when this effect expires (use GameProgression format)
        effected: string // who was effected (user id)
        interaction: ReferenceData.Interaction // what role 
        role: string|undefined // optianal role associated with this interaction
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private _owner: string
        private _end: number
        private _effected: string
        private _interaction: ReferenceData.Interaction
        private _role: string|undefined
        
        private useSetter() {
            this.reactSetter([{
                type: "Interaction",
                UUID: this.UUID,
                active: this.active,
                owner: this._owner,
                end: this._end,
                effected: this._effected,
                interaction: this._interaction,
                role: this._role
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            
            this._owner = reactState.owner;
            this._end = reactState.end;
            this._effected = reactState.effected;
            this._interaction = reactState.interaction;
            this._role = reactState.role;
        }
        
        get isActive() {
            return this.active
        }
        
        get effect() {
            if (!this.active) {
                return Effect.NONE
            } else {
                return this._interaction.effect
            }
        }
        
        get owner() {
            return this._owner
        }
        
        get effected() {
            return this._effected
        }
        
        get name() {
            return this._interaction.name
        }
        
        get id() {
            return this.UUID
        }
        
        get fromRole() {
            return this._interaction.role
        }
        
        get role() {
            return this._role
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Interaction",
                UUID: this.UUID,
                active: this.active,
                owner: this._owner,
                end: this._end,
                effected: this._effected,
                interaction: this._interaction,
                role: this._role
            }
            return JSON.stringify(formatDocument)
        }
    }

}