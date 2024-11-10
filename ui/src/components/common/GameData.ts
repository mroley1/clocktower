import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"
import { Interaction } from "./reactStates/Intereaction"
import ScriptData from "./ScriptData"
import { Metadata } from "./reactStates/Metadata"
import BaseReactState from "./reactStates/_BaseReactState"

export interface GameData {
    metadata: Metadata.Data
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
    interactions: Interaction.Data[]
}

export interface GameDataJSON {
    metadata: Metadata.ReactState
    playerCount: PlayerCount.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
    interactions: Interaction.ReactState[]
}

export interface TransactionJSON {
    owner: string|undefined
    new: BaseReactState[],
    old: BaseReactState[]
}

export interface HistoryJSON {
    head: number,
    transactions: TransactionJSON[]
}

export interface GameDataJSONTag {
    gameID: number
    name: string
    gameProgression: GameProgression.ReactState
    playerRoles: string[]
    script: ScriptData|undefined
    created: number
}