import { Ailment } from './Ailment'
import { Alignment } from './Alignment'
import Role from './Role'

export default interface Player {
    id: number
    role: Role | undefined
    name: string
    xpos: number
    ypos: number
    pubNotes: string
    privNotes: string
    ailments: Ailment[]
    mad: Role | null
    convinced: Role | null
    bluffs: Role[]
    alignment: Alignment
}