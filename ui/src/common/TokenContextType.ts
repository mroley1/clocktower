import Player from "./Player"
import RadialMenuState from "./RadialMenuState"

export default interface TokenContextType {
    json: Player
    menuState: RadialMenuState
    util: {
        setPlayerData: Function,
        toggleMenuState: Function,
        closeMenu: Function
    }
}