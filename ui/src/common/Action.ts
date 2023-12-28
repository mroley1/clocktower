import { ChooseType } from "./ChooseType";
import { Result } from "./Result";

export default interface Action {
    title: string
    choose: ChooseType
    results: Result[]
}