import { useContext, useEffect } from 'react';
import './MoveBoard.scss';
import { GameContext } from '../App'
import Token from './token/Token';

function MoveBoard() {
    
    const gameContext = useContext(GameContext)
    
    function exitContext() {
        const tmp = JSON.parse(JSON.stringify(gameContext.state));
        tmp["tokens"][0].name = "test"
        gameContext.setter(tmp)
    }
    
    function makeMovable() {
      const movieBoard = document.getElementById('moveBoard')
      if (movieBoard == null) {
        console.error("cannot fetch list of movable elements")
      }
      const movies = movieBoard!.children
      for (let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        console.log(movie)
        movie.addEventListener('pointerdown', dragEvent)
      }
    }
    
    const dragEvent = (function (event: any) {
      event.preventDefault()
      
      event.target.style.zIndex = "1"
      
      event.target.removeEventListener('pointerdown', dragEvent)
      
      const xOffset = event.offsetX
      const yOffset = event.offsetY
      
      const elemId = event.target.id
      
      const drag = (function(event: any) {
        var target = document.getElementById(elemId)
        if (target == null) {
          console.error("tried to drag nonexistant item")
        }
        target!.style.top = (event.clientY - yOffset).toString() + "px"
        target!.style.left = (event.clientX - xOffset).toString() + "px"
      })
      
      const dragUp = (function() {
        document.onpointermove = null
        const target = document.getElementById(elemId)
        if (target == undefined || target == null) {
          console.error("could not find token to update position")
        }
        target!.style.zIndex = "";
        const index = target?.getAttribute('data-index')
        const tmp = JSON.parse(JSON.stringify(gameContext.state));
        tmp["tokens"][index!].xpos = target?.getBoundingClientRect().x
        tmp["tokens"][index!].ypos = target?.getBoundingClientRect().y
        gameContext.setter(tmp)
      })
      
      document.onpointermove = drag
      document.onpointerup = dragUp
    })
    
    useEffect(() => {
      makeMovable()
    })
    
    const tokens = gameContext.state.tokens.map((token: any) => <Token key={token.id} json={token} />)
  
  return (
    <div id='moveBoard'>
        {tokens}
    </div>
  );
}

export default MoveBoard;