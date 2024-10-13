import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"
import { Interaction } from "./reactStates/Intereaction"
import { Transaction } from "./reactStates/Transaction"

export interface GameData {
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
    interactions: Interaction.Data[]
    transactions: Transaction.Data[]
}

export interface GameDataJSON {
    gameID: string
    historyHead: number
    playerCount: PlayerCount.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
    interactions: Interaction.ReactState[]
    transactions: Transaction.ReactState[]
}