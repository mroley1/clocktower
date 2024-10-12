import { GameDataJSON } from "./GameData"


export namespace ReferenceData {
    export interface ContextFormat {
        role: Role,
        nightOrder: NightOrder,
        jinxes: Jinxes,
        script: Script,
        fabled: Fabled,
        utilies: {
            saveGame: (gameDataJSON: GameDataJSON) => void,
            quitGame: () => void
        }
    }
    
    export class Role {}
    
    export class NightOrder {}
    
    export class Jinxes {}
    
    export class Script {}
    
    export class Fabled {}
}