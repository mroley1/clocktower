export interface BaseReactState {
    type: string,
    UUID: string,
    active: boolean,
    stale: boolean
}

export interface BaseReactData {
    resetToDefaults: () => void
}