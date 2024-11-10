import { useContext, useState } from "react";
import style from "./NightGuide.module.scss";
import { DataContext, GameContext } from "../Game";
import { Alignmant } from "../../../components/common/RoleType";
import { ReferenceData } from "@/components/common/ReferenceData";
import { CSSTransition } from "react-transition-group"

function NightGuide() {
    
    const dataContext = useContext(DataContext)
    const gameContext = useContext(GameContext)
    
    var nightOrder: ReferenceData.NightOrderTurn[] = []
    if (gameContext.gameProgression.night) {
        if (gameContext.gameProgression.night == 1) {
            nightOrder = dataContext.nightOrder.getFirstNight(gameContext.players);
        } else {
            nightOrder = dataContext.nightOrder.getOtherNight(gameContext.players);
        }
    }
    
    const [focusedIndex, setFocusedIndex] = useState(0)
    function setCurrentTurn(focusedIndex: number) {
        gameContext._globals.currentTurnOwner = nightOrder[focusedIndex].UUID
        setFocusedIndex(focusedIndex)
    }
    function next(event: React.PointerEvent<HTMLDivElement>) {
        event.stopPropagation();
        if (focusedIndex < nightOrder.length) {
            setCurrentTurn(focusedIndex + 1)
        }
    }
    function last(event: React.PointerEvent<HTMLDivElement>) {
        event.stopPropagation();
        if (focusedIndex >= 0) {
            setCurrentTurn(focusedIndex - 1)
        }
    }
    
    const [showDescription, setShowDescription] = useState(false)
    function toggleDescription(event: React.PointerEvent<HTMLDivElement>) {
        event.stopPropagation()
        setShowDescription(!showDescription)
    }
    
    return (
        <div className={style.container}>
            <div className={style.turntable} style={{transform: `rotate(${focusedIndex*25}deg)`}} onClick={toggleDescription}>
                {nightOrder.map((turnData, index) => {
                    if (index > focusedIndex - 4 && index < focusedIndex + 4) {
                        var callback = toggleDescription
                        if (index < focusedIndex) {callback = last}
                        if (index > focusedIndex) {callback = next}
                        return (
                            <CSSTransition key={turnData.UUID} in={showDescription} timeout={300} classNames={{...style}}>
                                <div className={style.nightTurn} style={{transform: `rotate(${-index*25}deg)`}} >
                                    <div className={style.tile} data-alignment={Alignmant[turnData.alignment]} onClick={callback}>
                                        <img src={getImage(turnData.role, turnData.alignment)}></img>
                                    </div>
                                    <div className={style.description} style={{display: index==focusedIndex? undefined : "none"}}>
                                        <div className={style.shapeLeft}></div>
                                        <div className={style.shapeRight}></div>
                                        <span>{turnData.description}</span>
                                    </div>
                                </div>
                            </CSSTransition>
                        )
                    } else return null
                })}
            </div>
        </div>
    )
}

function getImage(role: string, alignment: Alignmant) {
    if (role && alignment != Alignmant.NONE) {
        if (alignment == Alignmant.GOOD) {
            var imageName = role + "_good.png"
        } else {
            var imageName = role + "_evil.png"
        }
        return require("../../../assets/icons/" + imageName)
    } else return null
}

export default NightGuide
