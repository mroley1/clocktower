import Action from "./action/Action"
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
    actions: Action[]
    hardMad: boolean
    getsBluffs: boolean
}