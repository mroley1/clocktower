// import { useContext, useEffect, useState } from "react";
// import style from "./NightGuide.module.scss";
// import { ControllerContext, ReferenceContext, GameContext } from "../Game";
// import { Alignmant } from "../../../components/common/RoleType";
// import { ReferenceData } from "@/components/common/ReferenceData";
// import { CSSTransition } from "react-transition-group"

// function NightGuide() {
    
//     const referenceContext = useContext(ReferenceContext)
//     const gameContext = useContext(GameContext)
//     const controllerContext = useContext(ControllerContext)
    
//     var nightOrder: ReferenceData.NightOrderTurn[] = []
//     if (gameContext.gameProgression.night) {
//         if (gameContext.gameProgression.night == 1) {
//             nightOrder = referenceContext.nightOrder.getFirstNight(gameContext.players);
//         } else {
//             nightOrder = referenceContext.nightOrder.getOtherNight(gameContext.players);
//         }
//     }
    
//     let initalFocusedIndex = 0
//     if (nightOrder.length > 0 && gameContext.gameProgression.isNight) {
//         initalFocusedIndex = nightOrder.findIndex((value) => value.UUID == gameContext.gameProgression.currentTurn)
//         if (initalFocusedIndex < 0) {
//             initalFocusedIndex = 0
//         }
        
//     }
    
//     const [focusedIndex, setFocusedIndex] = useState(initalFocusedIndex)
    
//     useEffect(() => {
//         if (gameContext.gameProgression.currentTurn && nightOrder.length > 0) {
//             if (gameContext.gameProgression.isNight) {
//                 let focusedIndex = nightOrder.findIndex((value) => value.UUID == gameContext.gameProgression.currentTurn)
//                 if (focusedIndex < 0) {
//                     focusedIndex = 0
//                 }
//                 setFocusedIndex(focusedIndex)
//             }
//         }
//     }, [gameContext.gameProgression.currentTurn])
    
//     function setCurrentTurn(focusedIndex: number) {
//         gameContext.gameProgression.currentTurn = nightOrder[focusedIndex].UUID
//         setFocusedIndex(focusedIndex)
//     }
//     function next(event: React.PointerEvent<HTMLDivElement>) {
//         event.stopPropagation();
//         if (focusedIndex < nightOrder.length) {
//             setCurrentTurn(focusedIndex + 1)
//         }
//     }
//     function last(event: React.PointerEvent<HTMLDivElement>) {
//         event.stopPropagation();
//         if (focusedIndex >= 0) {
//             setCurrentTurn(focusedIndex - 1)
//         }
//     }
    
//     const [showDescription, setShowDescription] = useState(false)
//     function toggleDescription(event: React.PointerEvent<HTMLDivElement>) {
//         event.stopPropagation()
//         setShowDescription(!showDescription)
//     }
    
//     return (
//         <div className={style.container} data-show={gameContext.gameProgression.isNight}>
//             <div className={style.turntable} style={{transform: `rotate(${focusedIndex*25}deg)`}} onClick={toggleDescription}>
//                 {nightOrder.map((turnData, index) => {
//                     if (index > focusedIndex - 4 && index < focusedIndex + 4) {
//                         var callback = toggleDescription
//                         if (index < focusedIndex) {callback = last}
//                         if (index > focusedIndex) {callback = next}
//                         return (
//                             <CSSTransition key={turnData.UUID} in={showDescription} timeout={300} classNames={{...style}}>
//                                 <div className={style.nightTurn} style={{transform: `rotate(${-index*25}deg)`}} >
//                                     <div className={style.tile} data-alignment={Alignmant[turnData.alignment]} onClick={callback}>
//                                         <img src={getImage(turnData.role, turnData.alignment)}></img>
//                                     </div>
//                                     <div className={style.description} style={{display: index==focusedIndex? undefined : "none"}}>
//                                         <div className={style.shapeLeft}></div>
//                                         <div className={style.shapeRight}></div>
//                                         <span>{turnData.description}</span>
//                                     </div>
//                                 </div>
//                             </CSSTransition>
//                         )
//                     } else return null
//                 })}
//             </div>
//         </div>
//     )
// }

// function getImage(role: string, alignment: Alignmant) {
//     if (role && alignment != Alignmant.NONE) {
//         if (alignment == Alignmant.GOOD) {
//             var imageName = role + "_good.png"
//         } else {
//             var imageName = role + "_evil.png"
//         }
//         return require("../../../assets/icons/" + imageName)
//     } else return null
// }

// export default NightGuide
