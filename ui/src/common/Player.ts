import Ailment from './Ailment'
import { Alignment } from './Alignment'
import Role from './Role'
import { Viability } from './Viability'

export default interface Player {
    id: string
    role: Role | null
    name: string
    xpos: number
    ypos: number
    pubNotes: string
    privNotes: string
    viability: Viability
    ailments: Ailment[]
    mad: string | null
    convinced: Role | null
    bluffs: string[]
    alignment: Alignment
    usedActions: string[]
}