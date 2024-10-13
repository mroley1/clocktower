import BaseReactState from "./_BaseReactState";

export namespace Interaction {
    
    export interface ReactState extends BaseReactState {
        type: string,
        UUID: string,
        active: boolean
    }
    
    export class Data {
        private reactSetter
        private UUID
        private active
        
        private useSetter() {
            this.reactSetter([{
                type: "Interaction",
                UUID: this.UUID,
                active: this.active
            }])
        }
        
        constructor(reactState: ReactState, reactSetter: (reactState: ReactState[]) => void) {
            this.UUID = reactState.UUID;
            this.active = reactState.active;
            this.reactSetter = reactSetter;
        }
        
        toJSON() {
            const formatDocument: ReactState = {
                type: "Interaction",
                UUID: this.UUID,
                active: this.active
            }
            return JSON.stringify(formatDocument)
        }
    }
}

 