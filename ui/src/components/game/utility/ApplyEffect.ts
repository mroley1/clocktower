import { Interaction } from "../../common/reactStates/Intereaction";
import { Player } from "@/components/common/reactStates/Player"
import { ReferenceData } from "@/components/common/ReferenceData";
import { Alignmant } from "@/components/common/RoleType";
import { CHANGE, CORRUPT, GRANT, KILL, MADDEN } from "@/data/common/roles";


        
export interface EffectKit {
    interaction: ReferenceData.Interaction
    player: Player.Data,
    roleSelect: (value: string|undefined) => void,
    alignmentSelect: (value: Alignmant|undefined) => void,
    madSelect: (value: string|undefined) => void,
    grantSelect: (value: string|undefined) => void
}

// returns true if interaction should be made false if interaction will be made later
export function applyEffect(effectKit: EffectKit): boolean {
    switch (effectKit.interaction.effect) {
        case Interaction.Effect.KILL:
            return _KILL(effectKit)
        case Interaction.Effect.CHANGE:
            return _CHANGE(effectKit)
        case Interaction.Effect.CORRUPT:
            return _CORRUPT(effectKit)
        case Interaction.Effect.MADDEN:
            return _MADDEN(effectKit)
        case Interaction.Effect.GRANT:
            return _GRANT(effectKit)
        default:
            return true
    }
}

function _KILL(effectKit: EffectKit) {
    effectKit.interaction = effectKit.interaction as KILL & ReferenceData.InteractionAdditions
    effectKit.player.kill()
    return true
}

function _CHANGE(effectKit: EffectKit) {
    effectKit.interaction = effectKit.interaction as CHANGE & ReferenceData.InteractionAdditions
    if (effectKit.interaction.static) {
        effectKit.roleSelect(effectKit.interaction.static)
    } else {
        effectKit.roleSelect(undefined)
    }
    return false
}

function _CORRUPT(effectKit: EffectKit) {
    effectKit.interaction = effectKit.interaction as CORRUPT & ReferenceData.InteractionAdditions
    if (effectKit.interaction.static) {
        effectKit.alignmentSelect(effectKit.interaction.static)
    } else {
        effectKit.alignmentSelect(undefined)
    }
    return false
}

function _MADDEN(effectKit: EffectKit) {
    effectKit.interaction = effectKit.interaction as MADDEN & ReferenceData.InteractionAdditions
    if (effectKit.interaction.static) {
        effectKit.madSelect(effectKit.interaction.static)
    } else {
        effectKit.madSelect(undefined)
    }
    return false
}

function _GRANT(effectKit: EffectKit) {
    effectKit.interaction = effectKit.interaction as GRANT & ReferenceData.InteractionAdditions
    if (effectKit.interaction.static) {
        effectKit.grantSelect(effectKit.interaction.static)
    } else {
        effectKit.grantSelect(undefined)
    }
    return false
}