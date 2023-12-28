import { MakeupModType } from "./MakeupModType"
import { RoleType } from "./RoleType"

export default interface MakeupMod {
    type: MakeupModType
    modifies: RoleType
    value: number
}