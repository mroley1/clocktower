import { Alignment } from "../Alignment"
import { RoleType } from "../RoleType"
import { ChooseType } from "./ChooseType"


export default interface Choice {
    title: string
    type: ChooseType
    quantity: number
    exposeRoles: boolean | null // for player selections
    typeRestriction: RoleType[] | null // for role selections
    alignmentRestriction: Alignment[] | null // for role selections
}