import { GameMode } from "./GameModes";
import Player from "./Player";

export default interface GameStateType {
    tokens: Player[]
    gameMode: GameMode
}