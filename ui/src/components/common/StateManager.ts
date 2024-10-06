import { GameData, GameDataJSON } from "./GameData";
import { PlayerCount } from "./reactStates/PlayerCount";
import { GameProgression } from "./reactStates/GameProgression";

export namespace StateManager {
    export enum EditActions {
        UPDATE,
        CREATE,
        DELETE
    }
    
    export class Controller {
        
        gameState: GameData
        setgameState: React.Dispatch<React.SetStateAction<GameData>>
        
        gameStateJSON: GameDataJSON|undefined
        
        private classMap = new Map<string, Object>()
        private usedUUIDs = new Set<string>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, settings?: GameDataJSON) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = settings;
            
            this.classMap.set("GameProgression", GameProgression.Data)
            this.classMap.set("PlayerCount", PlayerCount.Data)
        }
        
        private newUUID() {
            let UUID = null;
            while (!UUID || this.usedUUIDs.has(UUID)) {
                UUID = window.crypto.randomUUID();
            }
            this.usedUUIDs.add(UUID);
            return UUID;
        }
        
        private mapObject(obj: any, fn: (obj: any) => any): any {
            if (obj.hasOwnProperty("type")) {
                return fn(obj)
            }
            const mapped: any = {};
            for (const [key, value] of Object.entries(obj)) {
                mapped[key] = this.mapObject(value, fn);
            }
            return mapped;
        }
        
        private setValue(value: any) {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                if (obj.UUID == value.UUID) {
                    return value;
                } else {
                    return obj;
                }
            })
        }
        
        public build() {
            const newGameState = this.mapObject(this.gameStateJSON, (obj) => {
                this.usedUUIDs.add(obj.UUID);
                const callback = (reactState: any) => {
                    this.setValue(reactState)
                    this.build();
                }
                return new (this.classMap.get(obj.type) as any)(obj, callback);
            })
            
            this.setgameState(newGameState)
        }
    }
}