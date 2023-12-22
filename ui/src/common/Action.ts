import { ChooseType } from "./ChooseType";
import { Result } from "./Result";

export default interface Action {
    choose: ChooseType
    results: Result[]
}