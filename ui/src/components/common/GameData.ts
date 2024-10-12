import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"
import { Interaction } from "./reactStates/Intereaction"

export interface GameData {
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
    interactions: Interaction.Data[]
}

export interface GameDataJSON {
    gameID: string
    playerCount: PlayerCount.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
    interactions: Interaction.ReactState[]
}