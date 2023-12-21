import { useContext, useState } from 'react';
import './Token.scss';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import TokenMenu from './TokenMenu';

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json
  const MENU_OPEN = [GameMode.NIGHT]
  const icon = require(`@assets/icons/${json.role}.png`)
  const [menuState, setMenuState] = useState(false)
  
  function getStyles() {
    return {
      left: json.xpos,
      top: json.ypos,
      transition: menuState?"transition: top linear var(--menu_duration), left linear var(--menu_duration);":""
    }
  }
  
  const handleClick = (event: object) => {
    if (!MENU_OPEN.includes(gameContext.state.gameMode)) {
      return
    }
    toggleMenuState()
  }
  
  function toggleMenuState() {
    setMenuState(!menuState)
  }
  
  function openMenu() {
    const token = document.getElementById("token_"+json.id)
    
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
      </div>
      <div style={{pointerEvents: menuState?"inherit":"none", backgroundColor: menuState?"#00000040":"#00000000"}} className='token_menu' onClick={toggleMenuState}>DELETE THIS</div>
      <TokenMenu />
    </>
  );
}

export default Token;
