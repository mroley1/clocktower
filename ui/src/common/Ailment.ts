import { AilmentTypes } from "./AilmentTypes"
import Player from "./Player"
import Role from "./Role"

export default interface Ailment {
    type: AilmentTypes
    from: number | null
    mad: string | null
    duration: number
    priority: number
}