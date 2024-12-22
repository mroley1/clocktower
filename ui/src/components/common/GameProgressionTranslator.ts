import { GameProgression } from "./reactStates/GameProgression"

interface prgressIdToDayStateReturn {
    state: GameProgression.State,
    night: number
}
export function prgressIdToDayState(progressId: number): prgressIdToDayStateReturn {
    var state = GameProgression.State.SETUP
    if (!(progressId & 0b1)) {
        state = progressId & 0b10
            ? GameProgression.State.NIGHT
            : GameProgression.State.DAY
    }
    return {
        state,
        night: (progressId + 0b10) >> 2
    }
}
        
export function getExpireeFromLength(length: number, progressId: number) {
    if (length < 0) { // negative numbers have infinite length
        return -1
    }
    return (progressId + (length * 2)) - (progressId & 1)
}

export function isExpireeExpired(expiree: number, progressId: number) {
    if (expiree < 0) { // negative numbers have infinite length
        return false
    }
    return (progressId >= expiree)
}
