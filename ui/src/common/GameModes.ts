
export enum GameMode {
    DAY,
    NIGHT,
    MOVING,
    SETUP,
    RADIAL,
    BLINDRADIAL,
    PLAYERSELECT,
    ROLESELECT,
    MARK,
    NOMINATIONS,
}

const map = new Map();
map.set(GameMode.DAY, {"background": "yellow", "foreground": "#142869"})
map.set(GameMode.NIGHT, {"background": "#142869", "foreground": "yellow"})
map.set(GameMode.MOVING, {"background": "#2b7252", "foreground": "white"})
map.set(GameMode.SETUP, {"background": "red", "foreground": "black"})
map.set(GameMode.RADIAL, {"background": "purple", "foreground": "black"})
map.set(GameMode.BLINDRADIAL, {"background": "purple", "foreground": "black"})
map.set(GameMode.PLAYERSELECT, {"background": "purple", "foreground": "white"})
map.set(GameMode.ROLESELECT, {"background": "purple", "foreground": "white"})
map.set(GameMode.MARK, {"background": "yellow", "foreground": "black"})
map.set(GameMode.NOMINATIONS, {"background": "black", "foreground": "white"})

export namespace GameMode {
    export function color(gameMode: GameMode) {
        return map.get(gameMode)
    }
}


