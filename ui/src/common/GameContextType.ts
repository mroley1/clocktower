import GameStateType from "./GameStateType"

export default interface GameContextType {
    state: GameStateType
    setter: Function
}