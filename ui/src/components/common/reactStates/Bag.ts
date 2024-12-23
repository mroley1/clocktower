import { CTUUID } from "../../../components/game/utility/UUID";
import { BaseReactState, BaseReactData } from "./_BaseReactState";

export namespace Bag {
    
    export interface ReactState extends BaseReactState {
        type: string
        UUID: string
        active: boolean
        stale: boolean
        
        roles: string[]
        quantity: number
    }
    
    export function create(UUID?: string): ReactState {
        return {
            type: "Bag",
            UUID: UUID || CTUUID.create(),
            active: true,
            stale: false,
            roles: [],
            quantity: 20
        }
    }
    
    export class Data implements BaseReactData {
        private reactSetter
        private UUID
        private active
        private stale
        
        private _roles
        private _quantity
    
        private breakdown = {
            town: [0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 7, 7, 7, 9, 9, 9],
            out:  [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 1, 2],
            min:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3],
            dem:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }
        private CAP = 15;
        
        private useSetter() {
            this.stale = true;
            this.reactSetter([{
                type: "Bag",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                roles: this._roles,
                quantity: this._quantity
            }])
        }
        
        public resetToDefaults() {
            Object.assign(this, new Data(create(this.UUID), this.reactSetter))
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.stale = false;
            this.reactSetter = reactSetter;
            
            this._roles = reactState.roles;
            this._quantity = reactState.quantity;
        }
        
        set quantity(quantity: number) {
            if (quantity < 5) {quantity = 5}
            this._quantity = quantity;
            this.useSetter();
        }
        
        get quantity() {
            return this._quantity;
        }
        
        get townsfolk() {
            return this.breakdown.town[Math.min(this._quantity, this.CAP)];
        }
        
        get outsiders() {
            return this.breakdown.out[Math.min(this._quantity, this.CAP)];
        }
        
        get minions() {
            return this.breakdown.min[Math.min(this._quantity, this.CAP)];
        }
        
        get demons() {
            return this.breakdown.dem[Math.min(this._quantity, this.CAP)];
        }
        
        get travellers() {
            return Math.max(0, this._quantity - this.CAP);
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Bag",
                UUID: this.UUID,
                active: this.active,
                stale: this.stale,
                roles: this._roles,
                quantity: this._quantity
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 