import Action from "./Action"
import { Alignment } from "./Alignment"
import { RoleType } from "./RoleType"

export default interface Role {
    id: number
    name: string
    description: string
    alignment: Alignment
    type: RoleType
    firstNight: string
    otherNight: string
    secret: boolean
    actions: Action[]
    hardMad: boolean
    getsBluffs: boolean
}