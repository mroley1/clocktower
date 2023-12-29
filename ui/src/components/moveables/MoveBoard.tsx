import { useContext, useEffect } from 'react';
import './MoveBoard.scss';
import { GameContext } from '../App'
import Token from './token/Token';
import { MOVABLE } from '@/common/GameModes';

function MoveBoard() {
    
    const gameContext = useContext(GameContext)
    
    const createDragEvent = (
      function (index: number) {
        return function (event: any) {
          
          // check that game mode is one that allows items to be moved
          if (!MOVABLE.includes(gameContext.state.gameMode)) {
            return
          }
          
          // set high z- index and grabbing cursor
          event.target.style.zIndex = "30"
          event.target.style.cursor = "grabbing"
          
          var xOffset = 0
          var yOffset = 0
        
          // calculate offesets
          xOffset = event.clientX - event.target.getBoundingClientRect().x
          yOffset = event.clientY - event.target.getBoundingClientRect().y
          
          const elemId = event.target.id
          
          const drag = (function(event: any) {
            var target = document.getElementById(elemId)
            // error catching
            if (target == null) {
              console.error("tried to drag nonexistant item")
              dragUp()
            }
            // set position of token
            target!.style.left = (event.clientX - xOffset).toString() + "px"
            target!.style.top = (event.clientY - yOffset).toString() + "px"
          })
          
          const dragUp = (function() {
            // remove listeners
            document.onpointermove = null
            document.onpointercancel = null
            document.onpointerup = null
            // error catching
            const target = document.getElementById(elemId)
            if (target === undefined || target === null) {
              console.error("could not find token to update position")
              return
            }
            // reset z index and cursor type
            target!.style.zIndex = "";
            target!.style.cursor = "grab";
            // correct tokens to keep them on the page
            let boundingRect = target.getBoundingClientRect()
            let width = window.innerWidth
            let height = window.innerHeight
            if (boundingRect.left < 0) {
              target.style.left = "0px"
            } else if (boundingRect.right > width) {
              target.style.left = (width - boundingRect.width) + "px"
            }
            if (boundingRect.top < 0) {
              target.style.top = "0px"
            } else if (boundingRect.bottom > height) {
              target.style.top = (height - boundingRect.height) + "px"
            }
            // save to state
            const tmp = JSON.parse(JSON.stringify(gameContext.state));
            tmp["tokens"][index].xpos = target?.getBoundingClientRect().x
            tmp["tokens"][index].ypos = target?.getBoundingClientRect().y
            gameContext.setter(tmp)
          })
          
          // set listeners
          document.onpointermove = drag
          document.onpointercancel = dragUp
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