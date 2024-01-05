import GameStateType from "./GameStateType"

export default interface GameContextType {
    state: GameStateType
    setter: Function
    util: {
        setMode: Function,
        setOnBlock: Function,
        setScript: Function
    }
}