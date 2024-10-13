import { useContext, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';

interface PlayerPartialProps {playerData: Player.Data}
function PlayerPartial({playerData}: PlayerPartialProps) {
  
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  let xOffset = 0;
  let yOffset = 0;
  let active: HTMLDivElement
  function dragStart(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLDivElement
    xOffset = event.clientX - (target.getBoundingClientRect().x - target.parentElement!.getBoundingClientRect().x)
    yOffset = event.clientY - (target.getBoundingClientRect().y - target.parentElement!.getBoundingClientRect().y)
    if (event.pointerType == "touch") {
        active = target
        document.addEventListener("touchmove", touchMove)
        document.addEventListener("touchend", touchEnd)
    } else {
        active = target
        document.addEventListener("pointermove", pointermove)
        document.addEventListener("pointerup", pointerEnd)
        document.addEventListener("pointercancel", pointerEnd)
    }
  }
  
  function touchMove(event: TouchEvent) {
    console.log(event)
    const target = event.target as HTMLDivElement
    const boundingRect = target.getBoundingClientRect()
    let candidateX = event.targetTouches[0].clientX - xOffset
    let candidateY = event.targetTouches[0].clientY - yOffset
    if (candidateX < 0) {candidateX = 0}
    if (candidateX > window.innerWidth - boundingRect.width) {candidateX = window.innerWidth - boundingRect.width}
    if (candidateY < 0) {candidateY = 0}
    if (candidateY > window.innerHeight - boundingRect.height) {candidateY = window.innerHeight - boundingRect.height}
    target.style.left = candidateX + "px";
    target.style.top = candidateY + "px";
  }
  
  function pointermove(event: PointerEvent) {
    if (active) {
        const boundingRect = active.getBoundingClientRect()
        let candidateX = event.clientX - xOffset
        let candidateY = event.clientY - yOffset
        if (candidateX < 0) {candidateX = 0}
        if (candidateX > window.innerWidth - boundingRect.width) {candidateX = window.innerWidth - boundingRect.width}
        if (candidateY < 0) {candidateY = 0}
        if (candidateY > window.innerHeight - boundingRect.height) {candidateY = window.innerHeight - boundingRect.height}
        active.style.left = candidateX + "px";
        active.style.top = candidateY + "px";
    }
}
  
  function touchEnd(event: TouchEvent) {
    console.log(event)
    const target = event.target as HTMLDivElement
    if (target.getAttribute("data-id") == playerData.id) {
        playerData.position = {
            x: target.getBoundingClientRect().x,
            y: target.getBoundingClientRect().y
        }
        document.removeEventListener("touchmove", touchMove);
        document.removeEventListener("touchend", touchEnd);
    }
  }
  
  function pointerEnd() {
    if (active) {
        playerData.position = {
            x: active.getBoundingClientRect().x,
            y: active.getBoundingClientRect().y
        }
    }
    document.removeEventListener("pointermove", pointermove);
    document.removeEventListener("pointerup", pointerEnd);
    document.removeEventListener("pointercancel", pointerEnd)
}
  
  return (
    <div data-id={playerData.id} style={{left: playerData.position.x, top: playerData.position.y}} className={styles.token} onPointerDown={dragStart}></div>
  );
}

export default PlayerPartial;
