import ActionAilments from "./ActionAilments";
import Choice from "./Choice";

export default interface Action {
    title: string
    choices: Choice[]
    possibleAilments: ActionAilments[] // relevant if players are chosen
    singleton: boolean
}