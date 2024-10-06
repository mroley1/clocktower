import { GameProgression } from "./reactStates/GameProgression"

export interface GameData {
    playerCount: number
    gameProgression: GameProgression.Data
}

export interface GameDataJSON {
    playerCount: number,
    gameProgression: GameProgression.ReactState
}