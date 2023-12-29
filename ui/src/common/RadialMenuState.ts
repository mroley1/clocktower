import { GameMode } from "./GameModes"

export default interface RadialMenuState {
  open: boolean
  orgMode: GameMode | null
  dialogue: string
}