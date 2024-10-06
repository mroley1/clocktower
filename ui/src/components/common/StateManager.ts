import { GameData, GameDataJSON } from "./GameData";
import { PlayerCount } from "./reactStates/PlayerCount";
import { GameProgression } from "./reactStates/GameProgression";
import { Player } from "./reactStates/Player";
import sha256 from "crypto-js/sha256";

export namespace StateManager {
    type ReactStates = 
        GameProgression.ReactState |
        PlayerCount.ReactState |
        Player.ReactState
    
    export enum EditAction {
        UPDATE,
        CREATE,
        DELETE
    }
    
    const classMap = new Map<string, Object>()
    classMap.set("GameProgression", GameProgression.Data)
    classMap.set("PlayerCount", PlayerCount.Data)
    classMap.set("Player", Player.Data)
    
    class Transaction {
        UUID: string
        newValue: ReactStates|undefined
        oldValue: ReactStates|undefined
        editAction: EditAction
        
        constructor(UUID: string, newValue: ReactStates, oldValue: ReactStates, editAction: EditAction) {
            this.UUID = UUID
            this.newValue = newValue
            this.oldValue = oldValue
            this.editAction = editAction
        }
        
        public revert(controller: Controller) {
            switch (this.editAction) {
                case EditAction.UPDATE:
                    if (this.oldValue) {
                        controller.setValue(this.oldValue);
                    }
                    break;
                case EditAction.CREATE:
                    controller.deleteValue(this.UUID);
                    break;
                case EditAction.DELETE:
                    
            }
        }
    }
    
    export class Controller {
        
        gameState: GameData
        setgameState: React.Dispatch<React.SetStateAction<GameData>>
        
        gameStateJSON: GameDataJSON|undefined
        history: Transaction[] = []
        
        private usedUUIDs = new Set<string>()
        private instanceMap = new Map<string, {jsonHash: string, instance: Object}>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, settings?: GameDataJSON) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = settings;
        }
        
        private newUUID() {
            let UUID = null;
            while (!UUID || this.usedUUIDs.has(UUID)) {
                UUID = window.crypto.randomUUID();
            }
            this.usedUUIDs.add(UUID);
            return UUID;
        }
        
        private mapObject(obj: any, fn: (obj: ReactStates) => any): any {
            if (obj.hasOwnProperty("type")) {
                return fn(obj)
            }
            let mapped: any
            if (Array.isArray(obj)) {
                mapped = [];
                obj.forEach((member) => {
                    mapped.push(this.mapObject(member, fn));
                })
            } else {
                mapped = {};
                for (const [key, value] of Object.entries(obj)) {
                    mapped[key] = this.mapObject(value, fn);
                }
            }
            return mapped;
        }
        
        public setValue(value: ReactStates) {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                if (obj.UUID == value.UUID) {
                    return value;
                } else {
                    return obj;
                }
            })
            this.build();
        }
        
        public deleteValue(UUID: string) {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                if (obj.UUID == UUID) {
                    return null;
                } else {
                    return obj;
                }
            })
            this.build();
        }
        
        addPlayer = () => {
            console.log(this.gameStateJSON?.players)
            this.gameStateJSON?.players.push({
                type: "Player",
                UUID: this.newUUID(),
                name: "",
                role: 0,
                viability: {state: Player.ViabilityState.ALIVE, deadVote: true},
                position: {x: 0, y: 0}
            })
            console.log(this.gameStateJSON?.players)
            this.build()
        }
        
        public build() {
            const newGameState = this.mapObject(this.gameStateJSON, (obj) => {
                this.usedUUIDs.add(obj.UUID);
                const storedInstance = this.instanceMap.get(obj.UUID);
                if (storedInstance && sha256(JSON.stringify(obj)).toString() == storedInstance.jsonHash) {
                    return storedInstance.instance
                } else {
                    const callback = (reactState: ReactStates) => {
                        this.setValue(reactState)
                    }
                    const newClass = new (classMap.get(obj.type) as any)(obj, callback);
                    this.instanceMap.set(obj.UUID, {jsonHash: sha256(JSON.stringify(obj)).toString(), instance: newClass})
                    return newClass
                }
            })
            
            
            this.setgameState(newGameState)
        }
        
        public toJSON() {
            throw new Error("Not Implemented yet :(")
        }
    }
}