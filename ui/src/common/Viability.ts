
export enum Viability {
    ALIVE,
    DEADFAINT,
    DEADFAINTVOTE,
    DEADVOTE,
    DEAD,
}

export const IS_ALIVE = [Viability.ALIVE, Viability.DEADFAINT, Viability.DEADFAINTVOTE]
export const CAN_VOTE = [Viability.ALIVE, Viability.DEADFAINT, Viability.DEADVOTE, Viability.DEADFAINTVOTE]