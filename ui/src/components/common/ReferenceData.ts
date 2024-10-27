import { GameDataJSON } from "./GameData"
import { Alignmant, ClassType } from "./RoleType"


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
    
    interface RoleData {
        id: string
        name: string
        description: string
        alignment: Alignmant
        classType: ClassType
        effects: {
            name: string
            effect: number
            length: number
            bound: boolean
            limitToSelf: boolean
            public: boolean
        }[]
        first_night_desc: string,
        other_night_desc: string,
        change_makeup: [],
        hide_face: boolean
    }
    export class Role {
        private roleData
        
        constructor() {
            this.roleData = require("../../data/common/roles.json")
        }
        
        getData(role: string): RoleData {
            return this.roleData[role]
        }
    }
    
    export class NightOrder {}
    
    export class Jinxes {}
    
    export class Script {
        private script
        
        constructor() {
            this.script = require('../../data/scripts/trouble_brewing.json')
        }
        
        get players(): string[] {
            return this.script.filter((obj: any) => typeof(obj) == "string")
        }
    }
    
    export class Fabled {}
}