import { AilmentTypes } from "./AilmentTypes"
import Player from "./Player"
import Role from "./Role"

export default interface Ailment {
    type: AilmentTypes
    from: Player | null
    mad: Role | null
    duration: number
    priority: number
}