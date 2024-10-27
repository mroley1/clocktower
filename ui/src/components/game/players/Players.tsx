import { MutableRefObject, useContext, useRef, useState } from 'react';
import styles from './Players.module.scss';
import { ControllerContext, DataContext, GameContext } from '../Game';
import PlayerPartial from './player/Player';
import React from 'react';
import { Player } from '@/components/common/reactStates/Player';
import { GameProgression } from '../../../components/common/reactStates/GameProgression';


function Players() {
  
  const gameContext = useContext(GameContext)
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  return (
    <div className={styles.dragContext}>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <button onClick={() => {controllerContext.addPlayer()}}>new</button>
        <br></br><br></br><br></br>
        <button onClick={gameContext.gameProgression.nextStage}>next</button>{gameContext.gameProgression.night}{GameProgression.State[gameContext.gameProgression.state]}
        <br></br><br></br>
        <button onClick={controllerContext.history.undo}>undo</button>
        <button onClick={controllerContext.history.redo}>redo</button>
        {
            gameContext.players.map(player => 
                <PlayerWrapper key={player.id} player={player}></PlayerWrapper>
            )
        }
    </div>
  );
}

export default Players;

function PlayerWrapper({player}: {player: Player.Data}) {
    const interactionHandles = useInteractionHandler(player)
    return (
        <div  data-id={player.id} style={{left: player.position.x, top: player.position.y}} className={styles.playerWrapper} onPointerDown={interactionHandles.pointerDown} ref={interactionHandles.wrapperRef}>
            <PlayerPartial playerData={player}></PlayerPartial>
        </div>
    )
}

const useInteractionHandler = (player: Player.Data) => {
    const wrapperRef = useRef<null|HTMLDivElement>(null);
    
    let xStart = 0;
    let yStart = 0;
    let xOffset = 0;
    let yOffset = 0;
    
    const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const active = wrapperRef.current
        if (!active) {return}
        const boundingRect = active.getBoundingClientRect()
        xStart = boundingRect.x;
        yStart = boundingRect.y;
        xOffset = event.clientX - (boundingRect.x - active.parentElement!.getBoundingClientRect().x)
        yOffset = event.clientY - (boundingRect.y - active.parentElement!.getBoundingClientRect().y)
        if (event.pointerType == "touch") {
            document.addEventListener("touchmove", touchMove)
            document.addEventListener("touchend", touchEnd)
        } else {
            document.addEventListener("pointermove", pointerMove)
            document.addEventListener("pointerup", pointerEnd)
            document.addEventListener("pointercancel", pointerEnd)
        }
    }
    
    const touchMove = (event: any) => {
        const target = event.target.parentElement as HTMLDivElement
        let candidateX = event.targetTouches[0].clientX - xOffset
        let candidateY = event.targetTouches[0].clientY - yOffset
        const positionResult = livePosition(candidateX, candidateY, target)
        if (!positionResult) {
            document.removeEventListener("pointermove", pointerMove);
            document.removeEventListener("pointerup", pointerEnd);
            document.removeEventListener("pointercancel", pointerEnd);
        }
    }
    const pointerMove = (event: PointerEvent) => {
        const active = wrapperRef.current
        if (active) {
            let candidateX = event.clientX - xOffset
            let candidateY = event.clientY - yOffset
            const positionResult = livePosition(candidateX, candidateY)
            if (!positionResult) {
                document.removeEventListener("pointermove", pointerMove);
                document.removeEventListener("pointerup", pointerEnd);
                document.removeEventListener("pointercancel", pointerEnd);
            }
        }
    }
    const touchEnd = (event: any) => {
        const target =  event.target.parentElement as HTMLDivElement
        console.log(target)
        if (target.getAttribute("data-id") == player.id) {
            const targetBox = target.getBoundingClientRect()
            if (targetBox.x == xStart && targetBox.y == yStart) {
                const event = new Event("data-select")
                target.dispatchEvent(event)
            } else {
                player.position = {
                    x: targetBox.x,
                    y: targetBox.y
                }
            }
            document.removeEventListener("touchmove", touchMove);
            document.removeEventListener("touchend", touchEnd);
        }
    }
    const pointerEnd = (event: PointerEvent) => {
        const active = wrapperRef.current
        if (active) {
            const targetBox = active.getBoundingClientRect()
            if (targetBox.x == xStart && targetBox.y == yStart) {
                const event = new Event("data-select")
                active.dispatchEvent(event)
            } else {
                player.position = {
                    x: targetBox.x,
                    y: targetBox.y
                }
            }
        }
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerup", pointerEnd);
        document.removeEventListener("pointercancel", pointerEnd);
    }
    const livePosition = (x: number, y: number, active = wrapperRef.current) => {
        if (!active) {return false}
        if (x < 0) {x = 0}
        if (x > window.innerWidth - 150) {x = window.innerWidth - 150}
        if (y < 0) {y = 0}
        if (y > window.innerHeight - 150) {y = window.innerHeight - 150}
        active.style.left = x + "px";
        active.style.top = y + "px";
        return true;
    }
    
    return {wrapperRef, pointerDown}
}