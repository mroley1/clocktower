import { GameData, GameDataJSON } from "./GameData";
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
        private objMap = new Map<string, Object>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, settings?: GameDataJSON) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = settings;
            
            this.classMap.set("GameProgression", GameProgression.Data)
        }
        
        private newUUID() {
            return window.crypto.randomUUID()
        }
        
        private mapObject(obj: any, fnValues: (val: any) => any, fnClasses: (obj: any) => any): any {
            if (typeof obj !== "object" || obj === null) {
                return fnValues(obj);
            }
            if (obj.hasOwnProperty("type")) {
                return fnClasses(obj)
            }
            const mapped: any = {};
            for (const [key, value] of Object.entries(obj)) {
                mapped[key] = this.mapObject(value, fnValues, fnClasses);
            }
            return mapped;
        }
        
        private setValue(value: any) {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, val => val, obj => {
                if (obj.UUID == value.UUID) {
                    return value;
                } else {
                    return obj;
                }
            })
        }
        
        public build() {
            const newGameState = this.mapObject(this.gameStateJSON, val => val, (obj) => {
                if (!this.objMap.has(obj.UUID)) {
                    this.objMap.set(obj.UUID, obj)
                }
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