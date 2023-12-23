import Player from "./Player"

export default interface TokenContextType {
    json: Player
    util: {
        setPlayerData: Function
    }
}