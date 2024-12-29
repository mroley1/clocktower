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
            quantity: 5
        }
    }
    
    export class Data implements BaseReactData {
        private reactSetter
        private UUID
        private active
        private stale
        
        private _roles
        private _quantity
        
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
        
        get roles() {
            return this._roles;
        }
        
        set roles(roles: string[]) {
            this._roles = roles;
            this.useSetter()
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

 