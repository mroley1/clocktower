import { PlayerCount } from "./reactStates/PlayerCount"
import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"
import { Interaction } from "./reactStates/Intereaction"
import ScriptData from "./ScriptData"
import { Metadata } from "./reactStates/Metadata"
import BaseReactState from "./reactStates/_BaseReactState"
import { _Global } from "./reactStates/_Global"

export interface GameData {
    metadata: Metadata.Data
    playerCount: PlayerCount.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
    interactions: Interaction.Data[]
    _global: _Global.Data
}

export interface GameDataJSON {
    metadata: Metadata.ReactState
    playerCount: PlayerCount.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
    interactions: Interaction.ReactState[]
    _global: _Global.ReactState
}

export interface TransactionJSON {
    new: BaseReactState[]
    old: BaseReactState[]
}

export interface HistoryJSON {
    head: number,
    transactions: TransactionJSON[]
}

export interface GameDataJSONTag {
    gameID: number
    name: string
    gameProgression: number
    playerRoles: string[]
    script: ScriptData
    created: number
}