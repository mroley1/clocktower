import { GameDataJSON } from "./GameData"
import { Player } from "./reactStates/Player"
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
        
        hasRoleName(roleName: string) {
            return this._roleNames.includes(roleName)
        }
        
        getRole(roleName: string) {
            return this._roles.find((role) => role.id == roleName);
        }
    }
    
        
    export interface NightOrderTurn {
        role: string,
        alignment: Alignmant,
        description: string,
        UUID: string|undefined,
        keyword: boolean
    }
    
    export class NightOrder {
        private nightOrder
        private script
        private _firstNight: {id: string, description: string}[]
        private _otherNight: {id: string, description: string}[]
        
        private readonly KEYWORDS = [
            {id: "DUSK", info: "Confirm all players have eyes closed. Wait approximately 10 seconds."},
            {id: "MINION_INFO", info: "If this game does not have 7 or more players skip this.\nIf more than one Minion, they all make eye contact with each other. Show the \"This is the Demon\" card. Point to the Demon."},
            {id: "DEMON_INFO", info: "If this game does not have 7 or more players skip this.\nShow the \"These are your minions\" card. Point to each Minion. Show the \"These characters are not in play\" card. Show 3 character tokens of good characters not in play."},
            {id: "DAWN", info: "Wait approximately 10 seconds. Call for eyes open; immediately announce which players (if anyone) died."}
        ]
        
        constructor(script: Script) {
            this.nightOrder = require('../../data/common/nightsheet.json');
            this.script = script;
            const transform = (roleList: string[]) => {
                return roleList.filter((roleName: string) => this.script.hasRoleName(roleName) || this.KEYWORDS.some((keyword) => keyword.id == roleName))
                .map((roleName: string) => {
                    const keyword = this.KEYWORDS.find((keyword) => keyword.id == roleName)
                    if (keyword) {
                        return {
                            id: keyword.id,
                            description: keyword.info
                        }
                    } else {
                        const role = this.script.getRole(roleName)
                        return {
                            id: role!.id,
                            description: role!.first_night_desc
                        }
                    }
                })
            }
            this._firstNight = transform(this.nightOrder.firstnight);
            this._otherNight = transform(this.nightOrder.firstnight);
        }
        
        get firstNight() {
            return this._firstNight
        }
        
        get otherNight() {
            return this._otherNight
        }
        
        getFirstNight(players: Player.Data[]) {
            let order: NightOrderTurn[] = []
            this._firstNight.forEach((role) => {
                if (this.KEYWORDS.some((keyword) => keyword.id == role.id)) {
                    order.push({
                        role: role.id,
                        alignment: Alignmant.NONE,
                        description: role.description,
                        UUID: undefined,
                        keyword: true
                    })
                }
                players.forEach((player) => {
                    if (role.id == player.role) {
                        order.push({
                            role: role.id,
                            alignment: player.alignment,
                            description: role.description,
                            UUID: player.id,
                            keyword: false
                        })
                    }
                })
            })
            return order
        }
        
        getOtherNight(players: Player.Data[]) {
            let order: NightOrderTurn[] = []
            this._otherNight.forEach((role) => {
                console.log(role)
                if (this.KEYWORDS.some((keyword) => keyword.id == role.id)) {
                    order.push({
                        role: role.id,
                        alignment: Alignmant.NONE,
                        description: role.description,
                        UUID: undefined,
                        keyword: true
                    })
                }
                players.forEach((player) => {
                    if (role.id == player.role) {
                        order.push({
                            role: role.id,
                            alignment: player.alignment,
                            description: role.description,
                            UUID: player.id,
                            keyword: false
                        })
                    }
                })
            })
            return order
        }
    }
    
    export class Jinxes {}
    
    export class Fabled {}
}