import { Ailment } from './Ailment'
import { Alignment } from './Alignment'
import Role from './Role'

export default interface Player {
    id: number
    role: Role
    name: string
    xpos: number
    ypos: number
    notes: string
    ailments: Ailment[]
    mad: Role
    convinced: Role
    bluffs: Role[]
    alignment: Alignment
}