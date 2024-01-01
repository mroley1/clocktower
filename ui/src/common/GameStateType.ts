import { GameMode } from "./GameModes";
import Player from "./Player";
import ScriptType from "./ScriptType";

export default interface GameStateType {
    tokens: Player[]
    script: ScriptType
    onBlock: number | null
    gameMode: GameMode
}