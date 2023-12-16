
export enum GameMode {
    DAY,
    NIGHT,
    MOVING,
    SETUP,
    RADIAL,
    PLAYERSELECT,
    ROLESELECT,
}

const map = new Map();
map.set(GameMode.DAY, "yellow")
map.set(GameMode.NIGHT, "#142869")
map.set(GameMode.MOVING, "#2b7252")
map.set(GameMode.SETUP, "lightred")
map.set(GameMode.RADIAL, "purple")
map.set(GameMode.PLAYERSELECT, "purple")
map.set(GameMode.ROLESELECT, "purple")

export namespace GameMode {
    export function color(gameMode: GameMode) {
        return map.get(gameMode)
    }
}


