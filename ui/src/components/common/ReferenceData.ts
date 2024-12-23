import { InteractionJSON } from "@/data/common/roles"
import { GameDataJSON } from "./GameData"
import { Player } from "./reactStates/Player"
import { Alignmant, ClassType } from "./RoleType"
import { Interaction } from "./reactStates/Intereaction"
import { CTUUID } from "../game/utility/UUID"


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
    
    export class Script {
        private script
        private _roleNames: string[]
        
        constructor(scriptJSON: any) {
            this.script = scriptJSON;
            this._roleNames = this.script.filter((obj: any) => typeof(obj) == "string");
        }
        
        get roleNames(): string[] {
            return this._roleNames;
        }
        
        hasRoleName(roleName: string) {
            return this._roleNames.includes(roleName)
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
        private _script: Script
        
        private _roleData
        private _roleList
        
        constructor(script: Script) {
            this._script = script;
            this._roleData = require("../../data/common/roles.json");
            for (let role of Object.keys(this._roleData)) {
                try { // ! REMOVE TRY WHEN ALL ROLES ARE UPDATED
                    this._roleData[role].interactions.forEach((effect: any) => {
                        effect.role = role
                        effect.UUID = CTUUID.create()
                    })
                } catch {}
            }
            this._roleList = this._script.roleNames.map(roleName => this._roleData[roleName])
        }
        
        hasRoleName(roleName: string) {
            return this._script.hasRoleName(roleName);
        }
        
        getRole(roleName: string): RoleData {
            return this._roleData[roleName]
        }
        
        get roleList(): RoleData[] {
            return this._roleList
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
        private roles
        private _firstNight: {id: string, description: string}[]
        private _otherNight: {id: string, description: string}[]
        
        private readonly KEYWORDS = [
            {id: "DUSK", info: "Confirm all players have eyes closed. Wait approximately 10 seconds."},
            {id: "MINION_INFO", info: "If this game does not have 7 or more players skip this.\nIf more than one Minion, they all make eye contact with each other. Show the \"This is the Demon\" card. Point to the Demon."},
            {id: "DEMON_INFO", info: "If this game does not have 7 or more players skip this.\nShow the \"These are your minions\" card. Point to each Minion. Show the \"These characters are not in play\" card. Show 3 character tokens of good characters not in play."},
            {id: "DAWN", info: "Wait approximately 10 seconds. Call for eyes open; immediately announce which players (if anyone) died."}
        ]
        
        constructor(roles: Roles) {
            this.nightOrder = require('../../data/common/nightsheet.json');
            this.roles = roles;
            const transform = (roleList: string[]) => {
                return roleList.filter((roleName: string) => this.roles.hasRoleName(roleName) || this.KEYWORDS.some((keyword) => keyword.id == roleName))
                .map((roleName: string) => {
                    const keyword = this.KEYWORDS.find((keyword) => keyword.id == roleName)
                    if (keyword) {
                        return {
                            id: keyword.id,
                            description: keyword.info
                        }
                    } else {
                        const role = this.roles.getRole(roleName)
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
        
        private _roles
        private _interactions: Interaction[] = []
        
        private _map: Map<string, Interaction> = new Map()
        
        constructor(roles: Roles) {
            this._roles = roles
            this._interactions = this._roles.roleList.flatMap((role: RoleData) => role.interactions)
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
        
        private _roles
        
        constructor(roles: Roles) {
            this._roles = roles
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
                alignment = this._roles.getRole(roleName)?.alignment
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