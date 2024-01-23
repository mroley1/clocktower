import ActionType from "./action/ActionType"
import { Alignment } from "./Alignment"
import MakeupMod from "./MakeupMod"
import { RoleType } from "./RoleType"

export default interface Role {
    id: string
    name: string
    description: string
    alignment: Alignment
    type: RoleType
    firstNight: string
    otherNight: string
    changeMakeup: MakeupMod[]
    secret: boolean
    actions: ActionType[]
    hardMad: boolean
    getsBluffs: boolean
}