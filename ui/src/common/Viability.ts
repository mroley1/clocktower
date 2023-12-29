
export enum Viability {
    ALIVE,
    DEADFAINT,
    DEADVOTE,
    DEAD,
}

export const IS_ALIVE = [Viability.ALIVE, Viability.DEADFAINT]
export const CAN_VOTE = [Viability.ALIVE, Viability.DEADFAINT, Viability.DEADVOTE]