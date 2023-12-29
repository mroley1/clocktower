import HeadsUpState from "./HeadsUpState";

export default interface HeadsUpContextType {
    state: HeadsUpState
    util: {
        toggleRadialMenuState: Function
    }
}