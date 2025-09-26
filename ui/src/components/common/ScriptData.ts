import Version from "../Version"
import { Role } from "./Types"

export default interface ScriptData {
    author: string
    name: string
    description: string
    created: number
    lastUpdated: number
    version: Version
    roles: Role[]
    customization: {} //? use for cusom rules, jinxes, alignments etc
}