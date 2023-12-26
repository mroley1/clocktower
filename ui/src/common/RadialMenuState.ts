import { ReactElement } from "react"
import { GameMode } from "./GameModes"

export default interface RadialMenuState {
  open: boolean
  orgMode: GameMode
  dialogue: string
}