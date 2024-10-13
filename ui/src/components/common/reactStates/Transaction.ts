import BaseReactState from "./_BaseReactState";

export namespace Transaction {
    
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean,
        newValues: BaseReactState[]
        oldValues: BaseReactState[]
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        newValues: BaseReactState[]
        oldValues: BaseReactState[]
        
        constructor(reactState: ReactState, reactSetter: (reactState: BaseReactState[], suppressHistory?: boolean) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
            
            this.newValues = reactState.newValues
            this.oldValues = reactState.oldValues
        }
        
        public revert() {
            this.reactSetter(this.oldValues, true);
        }
        
        public apply() {
            this.reactSetter(this.newValues, true);
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Transaction",
                UUID: this.UUID,
                active: this.active,
                newValues: this.newValues,
                oldValues: this.oldValues
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 