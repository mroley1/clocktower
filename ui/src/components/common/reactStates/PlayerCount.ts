
export namespace PlayerCount {
    export interface ReactState {
        type: string,
        UUID: string,
        quantity: number
    }
    
    export class Data {
        private reactSetter
        private UUID
        
        private _quantity: number
    
        private breakdown = {
            town: [0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 7, 7, 7, 9, 9, 9],
            out:  [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 1, 2],
            min:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3],
            dem:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }
        private CAP = 15;
        
        private useSetter() {
            this.reactSetter({
                type: "PlayerCount",
                UUID: this.UUID,
                quantity: this._quantity
            })
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState) => void) {
            this.UUID = reactState.UUID;
            this._quantity = reactState.quantity;
            this.reactSetter = reactSetter;
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
        
        public toJSON() {
            return JSON.stringify({
                type: "PlayerCount",
                UUID: this.UUID,
                state: this._quantity
            })
        }
    }
}