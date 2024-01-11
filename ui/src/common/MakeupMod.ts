import { RoleType } from "./RoleType"

export default interface MakeupMod {
    type: MakeupModType
    modifies: RoleType
    value: number
}

enum MakeupModType {
    ADD,
    SUB,
    SET
}