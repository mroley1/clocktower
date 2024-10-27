import { GameDataJSON } from "./GameData"
import { Alignmant, ClassType } from "./RoleType"


export namespace ReferenceData {
    export interface ContextFormat {
        roles: Roles,
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
    export class Roles {
        private roleData
        
        constructor() {
            this.roleData = require("../../data/common/roles.json");
        }
        
        getRole(roleName: string): RoleData {
            return this.roleData[roleName]
        }
        
        getAll() {
            return this.roleData
        }
    }
    
    export class Script {
        private script
        private _roleNames: string[]
        private _roles: RoleData[]
        
        constructor(roles: Roles) {
            this.script = require('../../data/scripts/trouble_brewing.json');
            this._roleNames = this.script.filter((obj: any) => typeof(obj) == "string");
            this._roles = this._roleNames.map((roleName) => roles.getRole(roleName));
        }
        
        get roleNames(): string[] {
            return this._roleNames;
        }
        
        get roles(): RoleData[] {
            return this._roles;
        }
        
        getRole(roleName: string) {
            return this._roles.find((role) => role.id == roleName);
        }
    }
    
    export class NightOrder {
        private nightOrder
        private script
        private _firstNight
        private _otherNight
        
        constructor(script: Script) {
            this.nightOrder = require('../../data/common/nightsheet.json');
            this.script = script;
            this._firstNight = this.nightOrder.firstnight.map((roleName: string) => this.script.getRole(roleName))
            this._otherNight = this.nightOrder.othernight.map((roleName: string) => this.script.getRole(roleName))
        }
        
        get firstNight(): RoleData[] {
            return this._firstNight
        }
        
        get otherNight(): RoleData[] {
            return this._otherNight
        }
    }
    
    export class Jinxes {}
    
    export class Fabled {}
}