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
