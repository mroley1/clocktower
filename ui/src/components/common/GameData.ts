import { GameProgression } from "./reactStates/GameProgression"

export default interface GameData {
    playercount: number
    gameProgression: GameProgression.Data
}