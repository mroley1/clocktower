import { useContext, useState } from 'react';
import './Token.scss';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import TokenMenu from './TokenMenu';

export const MOVABLE = [GameMode.MOVING]
export const CLICKABLE = [GameMode.NIGHT, GameMode.PLAYERSELECT, GameMode.ROLESELECT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json
  const MENU_OPEN = [GameMode.NIGHT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]
  const icon = require(`@assets/icons/${json.role}.png`)
  
  interface MenuState {
    open: boolean
    orgMode: GameMode
  }
  const startingMenuState: MenuState = {"open": false, "orgMode": GameMode.NIGHT}
  const [menuState, setMenuState] = useState(startingMenuState)
  
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
    var tmp: MenuState = JSON.parse(JSON.stringify(menuState));
    if (menuState.open) {
      tmp.open = false
      gameContext.util.setMode(tmp.orgMode)
    } else {
      tmp.open = true
      tmp.orgMode = gameContext.state.gameMode
      gameContext.util.setMode(GameMode.RADIAL)
    }
    setMenuState(tmp)
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
