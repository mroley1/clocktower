import { ElementType } from "react";
import DRUNK from "@assets/actions/ailments/DRUNK"
import POISON from "@/assets/actions/ailments/POISON";
import MAD from "@/assets/actions/ailments/MAD";
import NONE from "@/assets/actions/ailments/NONE";
import KILL from "@/assets/actions/ailments/KILL";
import KILLFAINT from "@/assets/actions/ailments/KILLFAINT";
import HEAL from "@/assets/actions/ailments/HEAL";
import REVIVE from "@/assets/actions/ailments/REVIVE";

export enum AilmentTypes {
    DRUNK,
    POISON,
    MAD,
    NONE,
    KILL,
    KILLFAINT,
    HEAL,
    REVIVE
}

const svgs = new Map<AilmentTypes, ElementType>()
svgs.set(AilmentTypes.DRUNK, DRUNK)
svgs.set(AilmentTypes.POISON, POISON)
svgs.set(AilmentTypes.MAD, MAD)
svgs.set(AilmentTypes.NONE, NONE)
svgs.set(AilmentTypes.KILL, KILL)
svgs.set(AilmentTypes.KILLFAINT, KILLFAINT)
svgs.set(AilmentTypes.HEAL, HEAL)
svgs.set(AilmentTypes.REVIVE, REVIVE)

export namespace AilmentTypes {
    export function svg(type: AilmentTypes): ElementType {
        if (svgs.has(type)) {
            return svgs.get(type)!
        } else {
            return NONE
        }
    }
}