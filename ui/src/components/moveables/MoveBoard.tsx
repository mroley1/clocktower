import { useContext, useEffect } from 'react';
import './MoveBoard.scss';
import { GameContext } from '../App'
import Token from './token/Token';
import GameStateType from '@/common/GameStateType';
import { GameMode } from '@/common/GameModes';

const MOVEMENT_ALLOWED = [GameMode.MOVING]

function MoveBoard() {
    
    const gameContext = useContext(GameContext)
    
    const createDragEvent = (
      function (index: number) {
        return function (event: any) {
          
          if (!MOVEMENT_ALLOWED.includes(gameContext.state.gameMode)) {
            return
          }
          
          event.target.style.zIndex = "30"
          event.target.style.cursor = "grabbing"
          
          var xOffset = 0
          var yOffset = 0
        
          if (event.type === "mousedown") {
            xOffset = event.clientX - event.target.getBoundingClientRect().x
            yOffset = event.clientY - event.target.getBoundingClientRect().y
          } else if (event.type === "touchstart") {
            xOffset = event.touches[0].clientX - event.target.getBoundingClientRect().x
            yOffset = event.touches[0].clientY - event.target.getBoundingClientRect().y
          }
          
          const elemId = event.target.id
          
          const drag = (function(event: any) {
            var target = document.getElementById(elemId)
            if (target == null) {
              console.error("tried to drag nonexistant item")
              dragUp()
            }
            target!.style.top = (event.clientY - yOffset).toString() + "px"
            target!.style.left = (event.clientX - xOffset).toString() + "px"
          })
          
          const dragUp = (function() {
            document.onpointermove = null
            document.onpointerup = null
            const target = document.getElementById(elemId)
            if (target === undefined || target === null) {
              console.error("could not find token to update position")
            }
            target!.style.zIndex = "";
            target!.style.cursor = "grab";
            const tmp = JSON.parse(JSON.stringify(gameContext.state));
            tmp["tokens"][index].xpos = target?.getBoundingClientRect().x
            tmp["tokens"][index].ypos = target?.getBoundingClientRect().y
            gameContext.setter(tmp)
          })
          
          document.onpointermove = drag
          document.onpointerup = dragUp
        }
      }
    )
    
    const tokens = gameContext.state.tokens.map(
      (token: any) =>
        <Token key={token.id} json={token} createDragEvent={createDragEvent} />
      )
  
  return (
    <div id='moveBoard'>
        {tokens}
    </div>
  );
}

export default MoveBoard;