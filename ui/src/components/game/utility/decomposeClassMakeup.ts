import { ReferenceData } from "@/components/common/ReferenceData";
import { ClassType } from "@/components/common/RoleType";


const ExpectedClassNumberBreakdown = {
    0: [0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 7, 7, 7, 9, 9, 9], // ? TOWN
    1: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 1, 2], // ? OUTSIDER
    2: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3], // ! MINION
    3: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // ! DEMON
    4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // ~ TRAVELLER
    5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // ^ FABLED
}

export interface BreakdownFormat {
    classType: ClassType,
    expected: number,
    extra: number[],
    locked: boolean,
    required: string[]
}

export function decomposeClassMakeup(roleList: ReferenceData.RoleData[], targetPlayerCount: number, classes: ClassType[]) {
    const classMakeup: BreakdownFormat[] = classes.map((classType) => {
        return { // ! handle static set values and required roles
            classType: classType,
            expected: ExpectedClassNumberBreakdown[classType][targetPlayerCount],
            extra: [0, 0],
            locked: false,
            required: ["flowergirl"]
        }
    })
    roleList.forEach(roleData => {
        if (!classMakeup.some((ledger) => ledger.classType == roleData.classType)) {
            classMakeup.push({
                classType: roleData.classType,
                expected: ExpectedClassNumberBreakdown[roleData.classType][targetPlayerCount],
                extra: [0, 0],
                locked: false,
                required: []
            })
        }
        roleData.change_makeup.forEach(makeup => {
            let ledger = classMakeup.find((ledger) => ledger.classType == makeup.classType)!
            if (typeof(makeup.alter) == "number") {
                ledger.expected = makeup.alter
                ledger.extra = [0, 0]
                ledger.locked = true;
            } else if (typeof(makeup.alter) == "string") {
                ledger.required.push(makeup.alter)
            } else { //? number[]
                if (ledger.locked) {return}
                const expectedMod = ((alter: number[]) => {
                    const avg = (alter[0] + alter[1]) / 2
                    if (avg > 0) {
                        return Math.floor(avg)
                    } else {
                        return Math.ceil(avg)
                    }
                })(makeup.alter)
                ledger.expected += expectedMod
                ledger.extra[0] += makeup.alter[0] - expectedMod
                ledger.extra[1] += makeup.alter[1] - expectedMod
            }
        })
    })
    return classMakeup
}