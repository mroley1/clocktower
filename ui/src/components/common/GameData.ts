import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"

export interface GameData {
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
}

export interface GameDataJSON {
    playerCount: PlayerCount.ReactState,
    gameProgression: GameProgression.ReactState
}