import { GameMode } from "./GameModes";
import Player from "./Player";
import Script from "./Script";

export default interface GameStateType {
    tokens: Player[]
    script: Script
    onBlock: number | null
    gameMode: GameMode
}