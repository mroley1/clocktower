import Role from './Role'

export default interface Player {
    id: number
    role: Role
    name: string
    xpos: number
    ypos: number
}