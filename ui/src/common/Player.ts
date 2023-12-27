import { Ailment } from './Ailment'
import { Alignment } from './Alignment'
import Role from './Role'
import { Viability } from './Viability'

export default interface Player {
    id: number
    role: Role | undefined
    name: string
    xpos: number
    ypos: number
    pubNotes: string
    privNotes: string
    viability: Viability
    ailments: Ailment[]
    mad: Role | null
    convinced: Role | null
    bluffs: Role[]
    alignment: Alignment
}