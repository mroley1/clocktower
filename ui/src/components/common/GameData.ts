import { GameProgression } from "./reactStates/GameProgression"
import { Player } from "./reactStates/Player"
import { Interaction } from "./reactStates/Intereaction"
import ScriptData from "./ScriptData"
import { Metadata } from "./reactStates/Metadata"
import BaseReactState from "./reactStates/_BaseReactState"
import { _Global } from "./reactStates/_Global"
import { Bag } from "./reactStates/Bag"

export interface GameData {
    metadata: Metadata.Data
    gameProgression: GameProgression.Data
    players: Player.Data[]
    interactions: Interaction.Data[]
    _global: _Global.Data
    bag: Bag.Data
}

export interface GameDataJSON {
    metadata: Metadata.ReactState
    gameProgression: GameProgression.ReactState
    players: Player.ReactState[]
    interactions: Interaction.ReactState[]
    _global: _Global.ReactState
    bag: Bag.ReactState
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
    gameProgression: GameProgression.ReactState
    playerRoles: string[]
    script: ScriptData|undefined
    created: number
}