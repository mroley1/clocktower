import { useContext, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';

interface PlayerPartialProps {playerData: Player.Data}
function PlayerPartial({playerData}: PlayerPartialProps) {
  
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  const updatePoisition = (position: Player.Position) => {
    playerData.position = position
  }
  const interactionHandler = new InteractionHandler(updatePoisition, playerData.id);
  
  const image = getImage(playerData)
  
  return (
    <div data-id={playerData.id} style={{left: playerData.position.x, top: playerData.position.y}} className={styles.token} onPointerDown={interactionHandler.dragStart}>
        <img className={styles.image} src={image}></img>
    </div>
  );
}

export default PlayerPartial;

function getImage(playerData: Player.Data) {
    if (playerData.role != "") {
        if (playerData.alignment == Alignmant.GOOD) {
            var imageName = playerData.role + "_good.png"
        } else {
            var imageName = playerData.role + "_evil.png"
        }
        return require("../../../../assets/icons/" + imageName)
    } else return null
}

class InteractionHandler {
    xOffset = 0;
    yOffset = 0;
    active: HTMLDivElement|undefined
    updatePosition: (position: Player.Position) => void
    UUID: string
    
    constructor(updatePosition: (position: Player.Position) => void, UUID: string) {
        this.updatePosition = updatePosition
        this.UUID = UUID
    }
    
    dragStart = (event: React.PointerEvent<HTMLDivElement>) => {
        this.active = (event.target as HTMLDivElement)
        this.xOffset = event.clientX - (this.active.getBoundingClientRect().x - this.active.parentElement!.getBoundingClientRect().x)
        this.yOffset = event.clientY - (this.active.getBoundingClientRect().y - this.active.parentElement!.getBoundingClientRect().y)
        if (event.pointerType == "touch") {
            document.addEventListener("touchmove", this.touchMove)
            document.addEventListener("touchend", this.touchEnd)
        } else {
            document.addEventListener("pointermove", this.pointermove)
            document.addEventListener("pointerup", this.pointerEnd)
            document.addEventListener("pointercancel", this.pointerEnd)
        }
      }
      
    touchMove = (event: TouchEvent) => {
        const target = event.target as HTMLDivElement
        const boundingRect = target.getBoundingClientRect()
        let candidateX = event.targetTouches[0].clientX - this.xOffset
        let candidateY = event.targetTouches[0].clientY - this.yOffset
        if (candidateX < 0) {candidateX = 0}
        if (candidateX > window.innerWidth - boundingRect.width) {candidateX = window.innerWidth - boundingRect.width}
        if (candidateY < 0) {candidateY = 0}
        if (candidateY > window.innerHeight - boundingRect.height) {candidateY = window.innerHeight - boundingRect.height}
        target.style.left = candidateX + "px";
        target.style.top = candidateY + "px";
      }
      
    pointermove = (event: PointerEvent) => {
        if (this.active) {
            const boundingRect = this.active.getBoundingClientRect()
            let candidateX = event.clientX - this.xOffset
            let candidateY = event.clientY - this.yOffset
            if (candidateX < 0) {candidateX = 0}
            if (candidateX > window.innerWidth - boundingRect.width) {candidateX = window.innerWidth - boundingRect.width}
            if (candidateY < 0) {candidateY = 0}
            if (candidateY > window.innerHeight - boundingRect.height) {candidateY = window.innerHeight - boundingRect.height}
            this.active.style.left = candidateX + "px";
            this.active.style.top = candidateY + "px";
        }
    }
      
    touchEnd = (event: TouchEvent) => {
        const target = event.target as HTMLDivElement
        if (target.getAttribute("data-id") == this.UUID) {
            this.updatePosition({
                x: target.getBoundingClientRect().x,
                y: target.getBoundingClientRect().y
            })
            document.removeEventListener("touchmove", this.touchMove);
            document.removeEventListener("touchend", this.touchEnd);
        }
        
      }
      
    pointerEnd = () => {
        if (this.active) {
            this.updatePosition({
                x: this.active.getBoundingClientRect().x,
                y: this.active.getBoundingClientRect().y
            })
        }
        document.removeEventListener("pointermove", this.pointermove);
        document.removeEventListener("pointerup", this.pointerEnd);
        document.removeEventListener("pointercancel", this.pointerEnd);
    }
    
}
