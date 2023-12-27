import { createContext, useContext, useState } from 'react';
import './Token.scss';
import TokenContextType from '@Common/TokenContextType';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import TokenMenu from './TokenMenu';
import { Alignment } from '@/common/Alignment';
import GameStateType from '@/common/GameStateType';
import RadialMenuState from '@/common/RadialMenuState';
import { Viability } from '@/common/Viability';


export const MOVABLE = [GameMode.MOVING]
export const CLICKABLE = [GameMode.NIGHT, GameMode.PLAYERSELECT, GameMode.ROLESELECT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]
export const TokenContext = createContext<TokenContextType>({
  json: {
    id: -1,
    role: undefined,
    name: "",
    xpos: 0,
    ypos: 0,
    pubNotes: "",
    privNotes: "",
    viability: Viability.ALIVE,
    ailments: [],
    mad: null,
    convinced: null,
    bluffs: [],
    alignment: Alignment.STORYTELLER
  },
  menuState: {
    open: false,
    orgMode: GameMode.SETUP,
    dialogue: "none"
  },
  util: {
    setPlayerData: () => {},
    toggleMenuState: () => {},
    closeMenu: () => {}
  }
});

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json
  const MENU_OPEN = [GameMode.NIGHT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]
  const IS_NIGHT = [GameMode.NIGHT, GameMode.RADIAL, GameMode.SETUP, GameMode.MARK, GameMode.MOVING]
  const IS_ALIVE = [Viability.ALIVE, Viability.DEADFAINT]
  const CAN_VOTE = [Viability.ALIVE, Viability.DEADFAINT, Viability.DEADVOTE]
  const icon = require(`@assets/icons/${json.role}.png`)
  
  const startingMenuState: RadialMenuState = {"open": false, "orgMode": GameMode.NIGHT, dialogue: "none"}
  const [menuState, setMenuState] = useState(startingMenuState)
  
  function getStyles() {
    var cursor = "unset"
    if (MOVABLE.includes(gameContext.state.gameMode)) {
      cursor = "grab"
    } else if (CLICKABLE.includes(gameContext.state.gameMode)) {
      cursor = "pointer"
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
  
  function toggleMenuState(dialogueName = "none") {
    var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
    if (menuState.open) {
      tmp.open = false
      gameContext.util.setMode(tmp.orgMode)
    } else {
      tmp.open = true
      tmp.dialogue = dialogueName
      tmp.orgMode = gameContext.state.gameMode
      if (IS_NIGHT.includes(gameContext.state.gameMode)) {
        gameContext.util.setMode(GameMode.RADIAL)
      } else {
        gameContext.util.setMode(GameMode.BLINDRADIAL)
      }
    }
    setMenuState(tmp)
  }
  
  function closeMenu() {
    var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
    tmp.open = false
    gameContext.util.setMode(tmp.orgMode)
    setMenuState(tmp)
  }
  
  function setPlayerData(json: Player) {
    var tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.tokens[json.id] = json
    gameContext.setter(tmp)
  }
  
  
  const tokenContext: TokenContextType = {
    json,
    menuState,
    util: {
      setPlayerData,
      toggleMenuState,
      closeMenu
    }
  }
  
  const tokenVisibility = (()=>{
    if (IS_NIGHT.includes(gameContext.state.gameMode)) {
      return "night"
    } else {
      return "day"
    }
  })()
  
  const playerViability = (()=>{
    if (tokenVisibility === "day") {
      return Viability[tokenContext.json.viability].toString().toLowerCase()
    } else {
      return ""
    }
  })()
  
  const viability = (()=>{
    if (IS_ALIVE.includes(tokenContext.json.viability)) {
      return "alive"
    } else {
      return "dead"
    }
  })()
  
  const ailments = json.ailments.map((ailment) => {
    return <div key={ailment} className={'ailment '+ ailment.toString().toLowerCase()}></div>
  })
  
  const canVote = (()=>{
    if (gameContext.state.gameMode===GameMode.NOMINATIONS) {
      if (CAN_VOTE.includes(tokenContext.json.viability)) {
        return <div className='vote_button yes'></div>
      } else {
        return <div className='vote_button no'></div>
      }
    } else {
      return <></>
    }
  })()
  
  const alignment = (() => {
    if (json.alignment === json.alignment) {
      return <div className={'alignment '+ json.alignment.toString().toLowerCase()}></div>
    } else {
      return <></>
    }
  })()
  
  const convinced = (() => {
    if (json.convinced !== null) {
      const icon = require(`@assets/icons/${json.convinced}.png`)
      return <div className='convinced'>
        <img src={icon}></img>
      </div>
    } else {
      return <></>
    }
  })()
  
  const onBlock = (() => {
    if (gameContext.state.gameMode === GameMode.NOMINATIONS && gameContext.state.onBlock === json.id) {
      return <div className='on_block'></div>
    } else {
      return <></>
    }
  })()
  
  return (
    <TokenContext.Provider value={tokenContext}>
      <div
        id={"token_"+tokenContext.json.id}
        onMouseDown={props.createDragEvent(tokenContext.json.id)}
        onTouchStart={props.createDragEvent(tokenContext.json.id)}
        onClick={handleClick}
        style={getStyles()}
        className={`token_container ${tokenVisibility} ${playerViability}`}
        >
          <div className='vote'></div>
          {canVote}
          <div style={{display: tokenVisibility === "night" ? "inherit" : "none", pointerEvents: "none"}}>
            <img src={icon} className={viability}></img>
            {ailments}
            {alignment}
            {convinced}
          </div>
          {onBlock}
          <div className='token_nametag'>{json.name}</div>
          <TokenMenu menuState={menuState} toggleMenuState={toggleMenuState} />
      </div>
    </TokenContext.Provider>
  );
}

export default Token;
