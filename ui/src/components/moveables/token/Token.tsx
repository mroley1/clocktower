import { useContext, useState } from 'react';
import './Token.scss';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import TokenMenu from './TokenMenu';

export const MOVABLE = [GameMode.MOVING]
export const CLICKABLE = [GameMode.NIGHT, GameMode.PLAYERSELECT, GameMode.ROLESELECT, GameMode.SETUP]

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json
  const MENU_OPEN = [GameMode.NIGHT, GameMode.SETUP]
  const icon = require(`@assets/icons/${json.role}.png`)
  const [menuState, setMenuState] = useState(false)
  
  function getStyles() {
    if (MOVABLE.includes(gameContext.state.gameMode)) {
      var cursor = "grab"
    } else if (CLICKABLE.includes(gameContext.state.gameMode)) {
      var cursor = "pointer"
    } else {
      var cursor = "unset"
    }
    return {
      left: json.xpos,
      top: json.ypos,
      cursor
    }
  }
  
  const handleClick = (event: object) => {
    if (!MENU_OPEN.includes(gameContext.state.gameMode)) {
      return
    }
    toggleMenuState()
  }
  
  function toggleMenuState() {
    if (menuState) {
      setMenuState(false)
      gameContext.util.setMode(GameMode.NIGHT)
    } else {
      setMenuState(true)
      gameContext.util.setMode(GameMode.RADIAL)
    }
  }
  
  return (
    <>
      <div
        id={"token_"+json.id}
        onMouseDown={props.createDragEvent(json.id)}
        onTouchStart={props.createDragEvent(json.id)}
        onClick={handleClick}
        style={getStyles()}
        className='token_container'
        >
          <img src={icon}></img>
          <TokenMenu json={json} menuState={menuState} toggleMenuState={toggleMenuState} />
      </div>
    </>
  );
}

export default Token;
