import { GameMode } from "./GameModes";
import Player from "./Player";
import QuickAccessSettingsType from "./QuickAccessSettingsType";
import ScriptType from "./ScriptType";

export default interface GameStateType {
    tokens: Player[]
    script: ScriptType
    onBlock: number | null
    gameMode: GameMode
    quickAccessSettings: QuickAccessSettingsType
}