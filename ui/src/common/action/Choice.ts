import { Alignment } from "../Alignment"
import { RoleType } from "../RoleType"
import { ChooseType } from "./ChooseType"


export default interface Choice {
    title: string
    type: ChooseType
    quantity: number
    exposeRoles: boolean | null // for player selections
    TypeRestriction: RoleType[] | null // for role selections
    AligignmentRestriction: Alignment[] | null // for role selections
}