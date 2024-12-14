import { GameProgression } from "./reactStates/GameProgression"

export function prgressIdToDayState(progressId: number) {
    let result = {state: GameProgression.State.SETUP, night: 0}
    const isSetup = progressId & 1
    progressId >>= 1
    if (progressId % 2) {
        result = {
            state: GameProgression.State.NIGHT,
            night: (progressId + 1) / 2
        }
    } else {
        result = {
            state: GameProgression.State.DAY,
            night: progressId / 2
        }
    }
    if (isSetup) {
        result.state = GameProgression.State.SETUP
    }
    return result
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
