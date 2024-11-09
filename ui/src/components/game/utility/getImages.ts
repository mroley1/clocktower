import { Player } from "@/components/common/reactStates/Player"
import { Alignmant } from "../../../components/common/RoleType"

export function getPlayerImage(playerData: Player.Data) {
    if (playerData.role) {
        if (playerData.alignment == Alignmant.GOOD) {
            var imageName = playerData.role + "_good.png"
        } else {
            var imageName = playerData.role + "_evil.png"
        }
        return require("../../../assets/icons/" + imageName)
    } else return null
}