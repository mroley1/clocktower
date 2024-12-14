import { InteractionJSON } from "@/data/common/roles"
import { GameDataJSON } from "./GameData"
import { Player } from "./reactStates/Player"
import { Alignmant, ClassType } from "./RoleType"
import { Interaction } from "./reactStates/Intereaction"


export namespace ReferenceData {
    export interface ContextFormat {
        roles: Roles
        script: Script
        image: Image
        nightOrder: NightOrder
        interactions: Interactions
        jinxes: Jinxes
        fabled: Fabled
        utilies: {
            saveGame: (gameDataJSON: GameDataJSON) => void,
            quitGame: () => void
        }
    }
    
    export type InteractionAdditions = {
        role: string,
        UUID: string
    }
    
    export type Interaction = InteractionJSON & InteractionAdditions
    
    interface RoleData {
        id: string
        name: string
        description: string
        alignment: Alignmant
        classType: ClassType
        interactions: Interaction[]
        first_night_desc: string,
        other_night_desc: string,
        change_makeup: [],
        hide_face: boolean
    }
    export class Roles {
        private roleData
        
        constructor() {
            this.roleData = require("../../data/common/roles.json");
            for (let role of Object.keys(this.roleData)) {
                try { // ! REMOVE TRY WHEN ALL ROLES ARE UPDATED
                    this.roleData[role].interactions.forEach((effect: any) => {
                        effect.role = role
                        effect.UUID = window.crypto.randomUUID()
                    })
                } catch {}
            }
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
            this._otherNight = transform(this.nightOrder.othernight);
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
                        UUID: "_" + role.id,
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
                if (this.KEYWORDS.some((keyword) => keyword.id == role.id)) {
                    order.push({
                        role: role.id,
                        alignment: Alignmant.NONE,
                        description: role.description,
                        UUID: "_" + role.id,
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
    
    export class Interactions {
        
        private _script
        private _interactions: Interaction[] = []
        
        private _map: Map<string, Interaction> = new Map()
        
        constructor(script: Script) {
            this._script = script
            this._interactions = this._script.roles.flatMap(role => role.interactions)
            this._interactions.forEach(interaction => {
                this._map.set(interaction.UUID, interaction)
            })
        }
        
        getInteractions(role: string|undefined = undefined, inPlay: string[]) {
            return this._interactions.filter(interaction => 
                interaction.role == role ||
                (interaction.availability != Interaction.EffectAvailability.TURN && inPlay.includes(interaction.role))
            )
        }
        
        getAllInterations(inPlay: string[]) {
            return this._interactions.filter(interaction => 
                inPlay.includes(interaction.role)
            )
        }
        
        getInteraction(UUID: string) {
            return this._map.get(UUID)
        }
    }
    
    export class Jinxes {}
    
    export class Fabled {}
    
    export class Image {
        
        private _script
        
        constructor(script: Script) {
            this._script = script
        }
        
        getPlayerImage(playerData: Player.Data) {
            if (playerData.role) {
                if (playerData.alignment == Alignmant.GOOD) {
                    var imageName = playerData.role + "_good.png"
                } else {
                    var imageName = playerData.role + "_evil.png"
                }
                return require("../../assets/icons/" + imageName)
            } else return null
        }
        
        getRoleImage(roleName: string, alignment: Alignmant|undefined = undefined) {
            if (!alignment) {
                alignment = this._script.getRole(roleName)?.alignment
            }
            if (roleName) {
                if (alignment == Alignmant.GOOD) {
                    var imageName = roleName + "_good.png"
                } else {
                    var imageName = roleName + "_evil.png"
                }
                return require("../../assets/icons/" + imageName)
            } else return null
        }
    }
}