import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"

export interface GameData {
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
}

export interface GameDataJSON {
    playerCount: PlayerCount.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
}